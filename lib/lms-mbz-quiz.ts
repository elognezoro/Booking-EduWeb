/**
 * Génération de l'export Moodle 4.5 pour les QUIZ : banque de questions (questions.xml) + activité quiz.
 * Couvre les types-cœur Moodle : multichoice (MCQ + Vrai/Faux), shortanswer, numerical.
 * Les autres types (Cloze, Appariement, Glisser-déposer, Ordonnancement, Texte à trous) ne sont pas
 * encore exportés (qtypes non-cœur / plugins) — ils sont ignorés et signalés.
 */
import type { McqData, TrueFalseData, ShortAnswerData, NumericalData } from "./lms-questions";

const NULL = "$@NULL@$";
// Auteur/propriétaire des questions : Moodle attend un id utilisateur numérique (jamais NULL, sinon
// échec de restauration sur la contrainte). 2 = compte admin par défaut d'un Moodle ; remappé vers
// l'utilisateur qui restaure (la sauvegarde n'embarque aucun utilisateur).
const AUTHOR_ID = 2;
const esc = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const f7 = (n: number) => (Number.isFinite(n) ? n : 0).toFixed(7);

/** Types de questions exportables vers Moodle (les autres sont ignorés pour l'instant). */
export const MBZ_EXPORTABLE_QTYPES = ["MCQ", "TRUEFALSE", "SHORTANSWER", "NUMERICAL"];

export interface MbzQuestion { type: string; name: string; questionText: string; generalFeedback: string; defaultMark: number; data: unknown }

interface Alloc { next: () => number }

function answerXml(id: number, text: string, fraction: number, format = 1): string {
  return `                    <answer id="${id}">
                      <answertext>${esc(text)}</answertext>
                      <answerformat>${format}</answerformat>
                      <fraction>${f7(fraction)}</fraction>
                      <feedback></feedback>
                      <feedbackformat>1</feedbackformat>
                    </answer>`;
}

/** Bloc <plugin_qtype_*_question> selon le type. Renvoie "" si non exportable. */
function qtypePlugin(q: MbzQuestion, a: Alloc): { moodleQtype: string; pluginXml: string } | null {
  let data: unknown;
  try { data = typeof q.data === "string" ? JSON.parse(q.data) : q.data; } catch { data = {}; }

  if (q.type === "MCQ" || q.type === "TRUEFALSE") {
    let options: { text: string; correct: boolean }[];
    let single: boolean;
    if (q.type === "TRUEFALSE") {
      const d = data as TrueFalseData;
      options = [{ text: "Vrai", correct: !!d.correct }, { text: "Faux", correct: !d.correct }];
      single = true;
    } else {
      const d = data as McqData;
      options = (d.options || []).map((o) => ({ text: o.text, correct: !!o.correct }));
      single = !d.multiple;
    }
    // Une question à choix multiple sans aucune bonne réponse est invalide pour Moodle
    // (aucune fraction à 100 %) → on l'ignore plutôt que de produire un .mbz refusé à l'import.
    if (!options.some((o) => o.correct)) return null;
    const nCorrect = options.filter((o) => o.correct).length || 1;
    const nWrong = options.filter((o) => !o.correct).length || 1;
    const answers = options.map((o) => {
      const frac = single ? (o.correct ? 1 : 0) : o.correct ? 1 / nCorrect : -1 / nWrong;
      return answerXml(a.next(), o.text, frac);
    }).join("\n");
    const plugin = `                <plugin_qtype_multichoice_question>
                  <answers>
${answers}
                  </answers>
                  <multichoice id="${a.next()}">
                    <layout>0</layout>
                    <single>${single ? 1 : 0}</single>
                    <shuffleanswers>1</shuffleanswers>
                    <correctfeedback></correctfeedback>
                    <correctfeedbackformat>1</correctfeedbackformat>
                    <partiallycorrectfeedback></partiallycorrectfeedback>
                    <partiallycorrectfeedbackformat>1</partiallycorrectfeedbackformat>
                    <incorrectfeedback></incorrectfeedback>
                    <incorrectfeedbackformat>1</incorrectfeedbackformat>
                    <answernumbering>abc</answernumbering>
                    <shownumcorrect>1</shownumcorrect>
                    <showstandardinstruction>0</showstandardinstruction>
                  </multichoice>
                </plugin_qtype_multichoice_question>`;
    return { moodleQtype: "multichoice", pluginXml: plugin };
  }

  if (q.type === "SHORTANSWER") {
    const d = data as ShortAnswerData;
    const ans = (d.answers || []).filter((x) => x.text.trim());
    const answers = ans.map((x) => answerXml(a.next(), x.text, (x.grade ?? 100) / 100, 0)).join("\n")
      + "\n" + answerXml(a.next(), "*", 0, 0); // joker (catch-all)
    const plugin = `                <plugin_qtype_shortanswer_question>
                  <answers>
${answers}
                  </answers>
                  <shortanswer id="${a.next()}">
                    <usecase>${d.caseSensitive ? 1 : 0}</usecase>
                  </shortanswer>
                </plugin_qtype_shortanswer_question>`;
    return { moodleQtype: "shortanswer", pluginXml: plugin };
  }

  if (q.type === "NUMERICAL") {
    const d = data as NumericalData;
    const ans = (d.answers || []);
    const records: string[] = [];
    const answers = ans.map((x) => {
      const id = a.next();
      records.push(`                    <numerical_record id="${a.next()}">
                      <answer>${id}</answer>
                      <tolerance>${f7(Math.abs(x.tolerance || 0))}</tolerance>
                    </numerical_record>`);
      return answerXml(id, String(x.value), (x.grade ?? 100) / 100, 0);
    });
    const wildId = a.next();
    answers.push(answerXml(wildId, "*", 0, 0));
    records.push(`                    <numerical_record id="${a.next()}">
                      <answer>${wildId}</answer>
                      <tolerance></tolerance>
                    </numerical_record>`);
    const plugin = `                <plugin_qtype_numerical_question>
                  <answers>
${answers.join("\n")}
                  </answers>
                  <numerical_units>
                  </numerical_units>
                  <numerical_options>
                    <numerical_option id="${a.next()}">
                      <showunits>3</showunits>
                      <unitsleft>0</unitsleft>
                      <unitgradingtype>0</unitgradingtype>
                      <unitpenalty>1.0000000</unitpenalty>
                    </numerical_option>
                  </numerical_options>
                  <numerical_records>
${records.join("\n")}
                  </numerical_records>
                </plugin_qtype_numerical_question>`;
    return { moodleQtype: "numerical", pluginXml: plugin };
  }

  return null; // type non exportable
}

export interface BankEntry { entryId: number; mark: number }

/** Construit le contenu de <question_categories> (un seul catégorie) + renvoie le mapping question→entryId. */
export function buildQuestionBank(
  questions: { q: MbzQuestion; mark: number; key: string }[],
  categoryId: number,
  contextId: number,
  stampSeed: string,
  now: number,
  a: Alloc,
): { xml: string; entries: Map<string, BankEntry>; exportedKeys: Set<string> } {
  const entries = new Map<string, BankEntry>();
  const exportedKeys = new Set<string>();
  const bankEntries: string[] = [];

  for (const item of questions) {
    const plugin = qtypePlugin(item.q, a);
    if (!plugin) continue; // type non exportable → ignoré
    const entryId = a.next();
    const versionId = a.next();
    const questionId = a.next();
    entries.set(item.key, { entryId, mark: item.mark });
    exportedKeys.add(item.key);
    bankEntries.push(`      <question_bank_entry id="${entryId}">
        <questioncategoryid>${categoryId}</questioncategoryid>
        <idnumber>${NULL}</idnumber>
        <ownerid>${AUTHOR_ID}</ownerid>
        <question_version>
          <question_versions id="${versionId}">
            <version>1</version>
            <status>ready</status>
            <questions>
              <question id="${questionId}">
                <parent>0</parent>
                <name>${esc(item.q.name)}</name>
                <questiontext>${esc(item.q.questionText)}</questiontext>
                <questiontextformat>1</questiontextformat>
                <generalfeedback>${esc(item.q.generalFeedback)}</generalfeedback>
                <generalfeedbackformat>1</generalfeedbackformat>
                <defaultmark>${f7(item.q.defaultMark || 1)}</defaultmark>
                <penalty>0.3333333</penalty>
                <qtype>${plugin.moodleQtype}</qtype>
                <length>1</length>
                <stamp>${stampSeed}+q${questionId}</stamp>
                <timecreated>${now}</timecreated>
                <timemodified>${now}</timemodified>
                <createdby>${AUTHOR_ID}</createdby>
                <modifiedby>${AUTHOR_ID}</modifiedby>
${plugin.pluginXml}
                <plugin_qbank_comment_question>
                  <comments>
                  </comments>
                </plugin_qbank_comment_question>
                <plugin_qbank_customfields_question>
                  <customfields>
                  </customfields>
                </plugin_qbank_customfields_question>
                <question_hints>
                </question_hints>
                <tags>
                </tags>
              </question>
            </questions>
          </question_versions>
        </question_version>
      </question_bank_entry>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<question_categories>
  <question_category id="${categoryId}">
    <name>Banque — export EduWeb</name>
    <contextid>${contextId}</contextid>
    <contextlevel>50</contextlevel>
    <contextinstanceid>0</contextinstanceid>
    <info></info>
    <infoformat>0</infoformat>
    <stamp>${stampSeed}+cat</stamp>
    <parent>0</parent>
    <sortorder>0</sortorder>
    <idnumber>${NULL}</idnumber>
    <question_bank_entries>
${bankEntries.join("\n")}
    </question_bank_entries>
  </question_category>
</question_categories>`;
  return { xml, entries, exportedKeys };
}
