import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { clampScore, type PracticalTask, type TaskEvaluation, type TaskVerdict } from "./practical";

/** La clé API Anthropic est-elle configurée ? Sinon, repli « évaluation par un formateur ». */
export function aiEvaluationAvailable(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export interface PracticalSubmission {
  /** Contenu binaire encodé base64 (PDF ou image), si un fichier a été déposé. */
  base64?: string;
  mediaType?: string; // application/pdf, image/png, image/jpeg, image/webp, image/gif
  fileName?: string;
  /** Contenu textuel (fichier texte décodé ou réponse saisie). */
  text?: string;
}

const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

const RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "integer", description: "Points attribués, entre 0 et le barème de la tâche." },
    verdict: { type: "string", enum: ["reussi", "partiel", "insuffisant", "illisible"] },
    justification: { type: "string", description: "Justification concise (2–4 phrases) en français, fondée sur des éléments observables." },
    points_forts: { type: "array", items: { type: "string" }, description: "Éléments réussis observés (0 à 4)." },
    points_a_ameliorer: { type: "array", items: { type: "string" }, description: "Manques ou pistes d'amélioration (0 à 4)." },
  },
  required: ["score", "verdict", "justification", "points_forts", "points_a_ameliorer"],
} as const;

const SYSTEM = `Tu es un évaluateur de la certification CERTEL (compétences numériques & IA, référentiels DigComp 2.2 / DigCompEdu / UNESCO).
Tu corriges la production déposée par un candidat pour UNE tâche pratique, en français.
Règles :
- Note de façon stricte mais juste, uniquement sur ce qui est réellement observable dans la production fournie.
- Le score doit être un entier compris entre 0 et le barème indiqué.
- Si la production est absente, illisible, vide ou hors sujet, mets verdict="illisible" et score=0.
- verdict : "reussi" (tous les critères remplis), "partiel" (critères partiellement remplis), "insuffisant" (très peu de critères), "illisible".
- Justification factuelle, sans flatterie ni jargon inutile. Tutoie le candidat ("tu as…").`;

function pendingResult(task: PracticalTask, submission: PracticalSubmission, justification: string): TaskEvaluation {
  return {
    key: task.key,
    title: task.title,
    max: task.max,
    score: 0,
    verdict: "pending",
    justification,
    strengths: [],
    gaps: [],
    evaluatedBy: "pending",
    fileName: submission.fileName,
  };
}

/** Évalue une tâche pratique avec Claude (sortie structurée). Repli formateur si indisponible/erreur. */
export async function evaluatePracticalTask(task: PracticalTask, submission: PracticalSubmission): Promise<TaskEvaluation> {
  const hasFile = Boolean(submission.base64 && submission.mediaType);
  const hasText = Boolean(submission.text && submission.text.trim().length > 0);
  if (!hasFile && !hasText) {
    return pendingResult(task, submission, "Aucune production déposée pour cette tâche.");
  }
  if (!aiEvaluationAvailable()) {
    return pendingResult(task, submission, "Évaluation automatique indisponible pour le moment. Cette tâche sera évaluée par un formateur.");
  }

  try {
    const client = new Anthropic();

    const content: Anthropic.ContentBlockParam[] = [
      {
        type: "text",
        text: `Tâche n°${task.n} — ${task.title}\nConsigne : ${task.consigne}\nBarème : ${task.max} points.\n\nVoici la production déposée par le candidat. Évalue-la au regard de la consigne, puis renvoie le résultat.`,
      },
    ];

    if (hasFile) {
      if (submission.mediaType === "application/pdf") {
        content.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: submission.base64! } });
      } else if (IMAGE_TYPES.has(submission.mediaType!)) {
        content.push({
          type: "image",
          source: { type: "base64", media_type: submission.mediaType as "image/png" | "image/jpeg" | "image/webp" | "image/gif", data: submission.base64! },
        });
      }
    }
    if (hasText) {
      content.push({ type: "text", text: `Réponse / contenu saisi par le candidat :\n"""\n${submission.text!.slice(0, 12000)}\n"""` });
    }

    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1500,
      thinking: { type: "adaptive" },
      system: SYSTEM,
      messages: [{ role: "user", content }],
      output_config: { format: { type: "json_schema", schema: RESULT_SCHEMA } },
    });

    if (response.stop_reason === "refusal") {
      return pendingResult(task, submission, "L'évaluation automatique n'a pas pu aboutir. Cette tâche sera revue par un formateur.");
    }

    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
    if (!textBlock) return pendingResult(task, submission, "Réponse d'évaluation vide. Cette tâche sera revue par un formateur.");

    const data = JSON.parse(textBlock.text) as {
      score: number;
      verdict: TaskVerdict;
      justification: string;
      points_forts: string[];
      points_a_ameliorer: string[];
    };

    return {
      key: task.key,
      title: task.title,
      max: task.max,
      score: clampScore(data.score, task.max),
      verdict: (["reussi", "partiel", "insuffisant", "illisible"] as const).includes(data.verdict as never) ? data.verdict : "partiel",
      justification: (data.justification || "").trim(),
      strengths: Array.isArray(data.points_forts) ? data.points_forts.filter(Boolean).slice(0, 4) : [],
      gaps: Array.isArray(data.points_a_ameliorer) ? data.points_a_ameliorer.filter(Boolean).slice(0, 4) : [],
      evaluatedBy: "ai",
      fileName: submission.fileName,
    };
  } catch (e) {
    console.error("CERTEL practical AI eval failed", task.key, e);
    return pendingResult(task, submission, "Erreur lors de l'évaluation automatique. Cette tâche sera évaluée par un formateur.");
  }
}
