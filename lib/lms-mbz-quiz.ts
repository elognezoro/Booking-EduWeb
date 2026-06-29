/**
 * Génération de l'export Moodle 4.5 pour les QUIZ : banque de questions (questions.xml) + activité quiz.
 * Types-cœur Moodle couverts : multichoice (QCM + Vrai/Faux), shortanswer, numerical, match (appariement),
 * multianswer (Cloze, via question parente + sous-questions enfants).
 * Non exportés (qtypes plugins/non-cœur) : glisser-déposer (ddwtos), ordonnancement, texte à trous (gapfill).
 */
import type { McqData, TrueFalseData, ShortAnswerData, NumericalData, ClozeData, MatchingData } from "./lms-questions";
import { clozeToMoodle, type ClozeGap } from "./lms-cloze";

const NULL = "$@NULL@$";
// Auteur/propriétaire des questions : Moodle attend un id utilisateur numérique (jamais NULL, sinon
// échec de restauration sur la contrainte). 2 = compte admin par défaut ; remappé vers l'utilisateur
// qui restaure (la sauvegarde n'embarque aucun utilisateur).
const AUTHOR_ID = 2;
const esc = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const f7 = (n: number) => (Number.isFinite(n) ? n : 0).toFixed(7);

/** Types de questions exportables vers Moodle (les autres sont ignorés et signalés dans l'UI). */
export const MBZ_EXPORTABLE_QTYPES = ["MCQ", "TRUEFALSE", "SHORTANSWER", "NUMERICAL", "CLOZE", "MATCHING"];

export interface MbzQuestion { type: string; name: string; questionText: string; generalFeedback: string; defaultMark: number; data: unknown }
export interface BankEntry { entryId: number; mark: number }
interface Alloc { next: () => number }

function parseData(q: MbzQuestion): Record<string, unknown> {
  try { const d = typeof q.data === "string" ? JSON.parse(q.data) : q.data; return (d && typeof d === "object" ? d : {}) as Record<string, unknown>; }
  catch { return {}; }
}

/* ---------------- Blocs <plugin_qtype_*_question> réutilisables ---------------- */
function answerXml(id: number, text: string, fraction: number, format = 1): string {
  return `                    <answer id="${id}">
                      <answertext>${esc(text)}</answertext>
                      <answerformat>${format}</answerformat>
                      <fraction>${f7(fraction)}</fraction>
                      <feedback></feedback>
                      <feedbackformat>1</feedbackformat>
                    </answer>`;
}

function multichoiceBlock(opts: { text: string; fraction: number }[], single: boolean, a: Alloc): string {
  const answers = opts.map((o) => answerXml(a.next(), o.text, o.fraction)).join("\n");
  return `                <plugin_qtype_multichoice_question>
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
}

function shortanswerBlock(answers: { text: string; fraction: number }[], usecase: boolean, a: Alloc, addJoker: boolean): string {
  const rows = answers.map((x) => answerXml(a.next(), x.text, x.fraction, 0));
  if (addJoker) rows.push(answerXml(a.next(), "*", 0, 0)); // joker (catch-all)
  return `                <plugin_qtype_shortanswer_question>
                  <answers>
${rows.join("\n")}
                  </answers>
                  <shortanswer id="${a.next()}">
                    <usecase>${usecase ? 1 : 0}</usecase>
                  </shortanswer>
                </plugin_qtype_shortanswer_question>`;
}

function numericalBlock(answers: { value: string; fraction: number; tolerance: number }[], a: Alloc, addJoker: boolean): string {
  const rows: string[] = [];
  const records: string[] = [];
  for (const x of answers) {
    const id = a.next();
    rows.push(answerXml(id, x.value, x.fraction, 0));
    records.push(`                    <numerical_record id="${a.next()}">
                      <answer>${id}</answer>
                      <tolerance>${f7(Math.abs(x.tolerance || 0))}</tolerance>
                    </numerical_record>`);
  }
  if (addJoker) {
    const wildId = a.next();
    rows.push(answerXml(wildId, "*", 0, 0));
    records.push(`                    <numerical_record id="${a.next()}">
                      <answer>${wildId}</answer>
                      <tolerance></tolerance>
                    </numerical_record>`);
  }
  return `                <plugin_qtype_numerical_question>
                  <answers>
${rows.join("\n")}
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
}

function matchBlock(pairs: { left: string; right: string }[], extras: string[], a: Alloc): string {
  const rows = [
    ...pairs.map((p) => ({ q: p.left, ans: p.right })),
    ...extras.map((e) => ({ q: "", ans: e })), // distracteur : énoncé vide
  ].map((r) => `                    <match id="${a.next()}">
                      <questiontext>${esc(r.q)}</questiontext>
                      <questiontextformat>1</questiontextformat>
                      <answertext>${esc(r.ans)}</answertext>
                    </match>`).join("\n");
  return `                <plugin_qtype_match_question>
                  <matchoptions id="${a.next()}">
                    <shuffleanswers>1</shuffleanswers>
                    <correctfeedback></correctfeedback>
                    <correctfeedbackformat>1</correctfeedbackformat>
                    <partiallycorrectfeedback></partiallycorrectfeedback>
                    <partiallycorrectfeedbackformat>1</partiallycorrectfeedbackformat>
                    <incorrectfeedback></incorrectfeedback>
                    <incorrectfeedbackformat>1</incorrectfeedbackformat>
                    <shownumcorrect>1</shownumcorrect>
                  </matchoptions>
                  <matches>
${rows}
                  </matches>
                </plugin_qtype_match_question>`;
}

/** Bloc qtype pour une question « simple » (hors Cloze). Renvoie null si non exportable. */
function qtypePlugin(q: MbzQuestion, a: Alloc): { moodleQtype: string; pluginXml: string } | null {
  const data = parseData(q);

  if (q.type === "MCQ" || q.type === "TRUEFALSE") {
    let options: { text: string; correct: boolean }[];
    let single: boolean;
    if (q.type === "TRUEFALSE") {
      const d = data as unknown as TrueFalseData;
      options = [{ text: "Vrai", correct: !!d.correct }, { text: "Faux", correct: !d.correct }];
      single = true;
    } else {
      const d = data as unknown as McqData;
      options = (d.options || []).map((o) => ({ text: o.text, correct: !!o.correct }));
      single = !d.multiple;
    }
    if (!options.some((o) => o.correct)) return null; // QCM sans bonne réponse = invalide pour Moodle
    const nCorrect = options.filter((o) => o.correct).length || 1;
    const nWrong = options.filter((o) => !o.correct).length || 1;
    const opts = options.map((o) => ({ text: o.text, fraction: single ? (o.correct ? 1 : 0) : o.correct ? 1 / nCorrect : -1 / nWrong }));
    return { moodleQtype: "multichoice", pluginXml: multichoiceBlock(opts, single, a) };
  }

  if (q.type === "SHORTANSWER") {
    const d = data as unknown as ShortAnswerData;
    const answers = (d.answers || []).filter((x) => x.text.trim()).map((x) => ({ text: x.text, fraction: (x.grade ?? 100) / 100 }));
    return { moodleQtype: "shortanswer", pluginXml: shortanswerBlock(answers, !!d.caseSensitive, a, true) };
  }

  if (q.type === "NUMERICAL") {
    const d = data as unknown as NumericalData;
    const answers = (d.answers || []).map((x) => ({ value: String(x.value), fraction: (x.grade ?? 100) / 100, tolerance: x.tolerance || 0 }));
    return { moodleQtype: "numerical", pluginXml: numericalBlock(answers, a, true) };
  }

  if (q.type === "MATCHING") {
    const d = data as unknown as MatchingData;
    const pairs = (d.pairs || []).filter((p) => p.left.trim() && p.right.trim());
    if (pairs.length < 2) return null; // Moodle exige au moins 2 paires valides
    const extras = (d.extraRights || []).filter((e) => e.trim());
    return { moodleQtype: "match", pluginXml: matchBlock(pairs, extras, a) };
  }

  return null; // type non exportable
}

/** Bloc qtype d'un champ Cloze (sous-question enfant). */
function clozeFieldBlock(gap: ClozeGap, a: Alloc): { qtype: string; xml: string } {
  if (gap.kind === "NUMERICAL") {
    const answers = gap.answers.map((x) => ({ value: x.text, fraction: (x.grade ?? 0) / 100, tolerance: x.tolerance || 0 }));
    return { qtype: "numerical", xml: numericalBlock(answers, a, false) };
  }
  if (gap.kind === "MULTICHOICE") {
    const opts = gap.answers.map((x) => ({ text: x.text, fraction: (x.grade ?? 0) / 100 }));
    return { qtype: "multichoice", xml: multichoiceBlock(opts, true, a) };
  }
  const answers = gap.answers.map((x) => ({ text: x.text, fraction: (x.grade ?? 0) / 100 }));
  return { qtype: "shortanswer", xml: shortanswerBlock(answers, gap.caseSensitive, a, false) };
}

/* ---------------- Entrées de banque ---------------- */
function oneEntry(o: { entryId: number; versionId: number; questionId: number; parent: number; name: string; questiontext: string; generalfeedback: string; defaultmark: number; qtype: string; pluginXml: string }, stampSeed: string, now: number): string {
  return `      <question_bank_entry id="${o.entryId}">
        <questioncategoryid>__CATID__</questioncategoryid>
        <idnumber>${NULL}</idnumber>
        <ownerid>${AUTHOR_ID}</ownerid>
        <question_version>
          <question_versions id="${o.versionId}">
            <version>1</version>
            <status>ready</status>
            <questions>
              <question id="${o.questionId}">
                <parent>${o.parent}</parent>
                <name>${esc(o.name)}</name>
                <questiontext>${esc(o.questiontext)}</questiontext>
                <questiontextformat>1</questiontextformat>
                <generalfeedback>${esc(o.generalfeedback)}</generalfeedback>
                <generalfeedbackformat>1</generalfeedbackformat>
                <defaultmark>${f7(o.defaultmark || 1)}</defaultmark>
                <penalty>0.3333333</penalty>
                <qtype>${o.qtype}</qtype>
                <length>1</length>
                <stamp>${stampSeed}+q${o.questionId}</stamp>
                <timecreated>${now}</timecreated>
                <timemodified>${now}</timemodified>
                <createdby>${AUTHOR_ID}</createdby>
                <modifiedby>${AUTHOR_ID}</modifiedby>
${o.pluginXml}
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
      </question_bank_entry>`;
}

/** Cloze → question parente « multianswer » + une sous-question enfant par champ. */
function buildClozeEntries(item: { q: MbzQuestion }, stampSeed: string, now: number, a: Alloc): { entriesXml: string[]; parentEntryId: number } | null {
  const clozeText = (parseData(item.q) as unknown as ClozeData).clozeText || "";
  const { parentText, fields } = clozeToMoodle(clozeText);
  if (!fields.length) return null;
  // Parent d'abord (id parent < ids enfants, comme Moodle), puis enfants.
  const parentEntryId = a.next(), parentVerId = a.next(), parentQId = a.next();
  const childQIds: number[] = [];
  const childEntries: string[] = [];
  fields.forEach((f, i) => {
    const cEntryId = a.next(), cVerId = a.next(), cQId = a.next();
    childQIds.push(cQId);
    const blk = clozeFieldBlock(f.gap, a);
    childEntries.push(oneEntry({ entryId: cEntryId, versionId: cVerId, questionId: cQId, parent: parentQId, name: `${item.q.name} (#${i + 1})`, questiontext: f.raw, generalfeedback: "", defaultmark: f.gap.weight, qtype: blk.qtype, pluginXml: blk.xml }, stampSeed, now));
  });
  const multianswerXml = `                <plugin_qtype_multianswer_question>
                  <answers>
                  </answers>
                  <multianswer id="${a.next()}">
                    <question>${parentQId}</question>
                    <sequence>${childQIds.join(",")}</sequence>
                  </multianswer>
                </plugin_qtype_multianswer_question>`;
  const parentEntry = oneEntry({ entryId: parentEntryId, versionId: parentVerId, questionId: parentQId, parent: 0, name: item.q.name, questiontext: parentText, generalfeedback: item.q.generalFeedback, defaultmark: item.q.defaultMark, qtype: "multianswer", pluginXml: multianswerXml }, stampSeed, now);
  return { entriesXml: [parentEntry, ...childEntries], parentEntryId };
}

/** Construit <question_categories> (catégorie unique) + le mapping question→entryId (parent pour Cloze). */
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
    if (item.q.type === "CLOZE") {
      const r = buildClozeEntries(item, stampSeed, now, a);
      if (!r) continue;
      bankEntries.push(...r.entriesXml);
      entries.set(item.key, { entryId: r.parentEntryId, mark: item.mark });
      exportedKeys.add(item.key);
      continue;
    }
    const plugin = qtypePlugin(item.q, a);
    if (!plugin) continue; // type non exportable → ignoré
    const entryId = a.next(), versionId = a.next(), questionId = a.next();
    entries.set(item.key, { entryId, mark: item.mark });
    exportedKeys.add(item.key);
    bankEntries.push(oneEntry({ entryId, versionId, questionId, parent: 0, name: item.q.name, questiontext: item.q.questionText, generalfeedback: item.q.generalFeedback, defaultmark: item.q.defaultMark, qtype: plugin.moodleQtype, pluginXml: plugin.pluginXml }, stampSeed, now));
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
${bankEntries.join("\n").replace(/__CATID__/g, String(categoryId))}
    </question_bank_entries>
  </question_category>
</question_categories>`;
  return { xml, entries, exportedKeys };
}
