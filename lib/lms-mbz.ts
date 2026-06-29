import { buildTarGz, type TarEntry } from "./lms-tar";
import { buildQuestionBank, type MbzQuestion } from "./lms-mbz-quiz";

/**
 * Génère une sauvegarde Moodle 4.5 (.mbz) à partir d'un cours LMS.
 * Format calqué sur une sauvegarde réelle Moodle 4.5.3 (course + sections + activités Page).
 * Phase 1 : les activités PAGE et URL/Média sont exportées comme modules « page » Moodle.
 */

const MOODLE_VERSION = "2024100703";
const MOODLE_RELEASE = "4.5.3 (Build: 20250317)";
const BACKUP_VERSION = "2024100700";
const BACKUP_RELEASE = "4.5";
const NULL = "$@NULL@$";
const STUDENT_ROLE_ID = 5;
const HEAD = '<?xml version="1.0" encoding="UTF-8"?>\n';

const esc = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export interface MbzPage { title: string; intro: string | null; content: string }
export interface MbzQuiz { title: string; intro: string | null; questions: { q: MbzQuestion; mark: number; key: string }[] }
export interface MbzSection { title: string; summary?: string | null; pages: MbzPage[]; quizzes?: MbzQuiz[] }
export interface MbzCourse { fullname: string; shortname: string; summary?: string; sections: MbzSection[] }

interface PageNode { cmid: number; instanceId: number; ctxId: number; title: string; intro: string; content: string; sectionId: number; sectionNumber: number }
interface QuizNode { cmid: number; instanceId: number; ctxId: number; gradeItemId: number; title: string; intro: string; sectionId: number; sectionNumber: number; questions: { q: MbzQuestion; mark: number; key: string }[] }
interface SectionNode { id: number; number: number; name: string | null; summary: string; pages: PageNode[]; quizzes: QuizNode[] }

/* ----------------------------- Fichiers par activité (page) ----------------------------- */
function pageXml(p: PageNode, now: number): string {
  return HEAD + `<activity id="${p.instanceId}" moduleid="${p.cmid}" modulename="page" contextid="${p.ctxId}">
  <page id="${p.instanceId}">
    <name>${esc(p.title)}</name>
    <intro>${esc(p.intro)}</intro>
    <introformat>1</introformat>
    <content>${esc(p.content)}</content>
    <contentformat>1</contentformat>
    <legacyfiles>0</legacyfiles>
    <legacyfileslast>${NULL}</legacyfileslast>
    <display>5</display>
    <displayoptions>a:2:{s:10:"printintro";s:1:"0";s:17:"printlastmodified";s:1:"1";}</displayoptions>
    <revision>1</revision>
    <timemodified>${now}</timemodified>
  </page>
</activity>`;
}

function moduleXml(p: PageNode, now: number): string {
  return HEAD + `<module id="${p.cmid}" version="${BACKUP_VERSION}">
  <modulename>page</modulename>
  <sectionid>${p.sectionId}</sectionid>
  <sectionnumber>${p.sectionNumber}</sectionnumber>
  <idnumber></idnumber>
  <added>${now}</added>
  <score>0</score>
  <indent>0</indent>
  <visible>1</visible>
  <visibleoncoursepage>1</visibleoncoursepage>
  <visibleold>1</visibleold>
  <groupmode>0</groupmode>
  <groupingid>0</groupingid>
  <completion>0</completion>
  <completiongradeitemnumber>${NULL}</completiongradeitemnumber>
  <completionpassgrade>0</completionpassgrade>
  <completionview>0</completionview>
  <completionexpected>0</completionexpected>
  <availability>${NULL}</availability>
  <showdescription>0</showdescription>
  <downloadcontent>1</downloadcontent>
  <lang></lang>
  <tags>
  </tags>
</module>`;
}

const PAGE_INFOREF = HEAD + "<inforef>\n</inforef>";
const PAGE_ROLES = HEAD + "<roles>\n  <role_overrides>\n  </role_overrides>\n  <role_assignments>\n  </role_assignments>\n</roles>";
const PAGE_GRADES = HEAD + "<activity_gradebook>\n  <grade_items>\n  </grade_items>\n  <grade_letters>\n  </grade_letters>\n</activity_gradebook>";
const PAGE_GRADE_HISTORY = HEAD + "<grade_history>\n  <grade_grades>\n  </grade_grades>\n</grade_history>";
const PAGE_CALENDAR = HEAD + "<events>\n</events>";
const PAGE_COMPETENCIES = HEAD + "<course_module_competencies>\n  <competencies>\n  </competencies>\n</course_module_competencies>";
const PAGE_FILTERS = HEAD + "<filters>\n  <filter_actives>\n  </filter_actives>\n  <filter_configs>\n  </filter_configs>\n</filters>";

/* ----------------------------- Quiz ----------------------------- */
function quizModuleXml(qz: QuizNode, now: number): string {
  return HEAD + `<module id="${qz.cmid}" version="${BACKUP_VERSION}">
  <modulename>quiz</modulename>
  <sectionid>${qz.sectionId}</sectionid>
  <sectionnumber>${qz.sectionNumber}</sectionnumber>
  <idnumber></idnumber>
  <added>${now}</added>
  <score>0</score>
  <indent>0</indent>
  <visible>1</visible>
  <visibleoncoursepage>1</visibleoncoursepage>
  <visibleold>1</visibleold>
  <groupmode>0</groupmode>
  <groupingid>0</groupingid>
  <completion>0</completion>
  <completiongradeitemnumber>${NULL}</completiongradeitemnumber>
  <completionpassgrade>0</completionpassgrade>
  <completionview>0</completionview>
  <completionexpected>0</completionexpected>
  <availability>${NULL}</availability>
  <showdescription>0</showdescription>
  <downloadcontent>1</downloadcontent>
  <lang></lang>
  <tags>
  </tags>
</module>`;
}

function quizActivityXml(qz: QuizNode, entries: Map<string, { entryId: number }>, now: number, alloc: () => number): string {
  const slots = qz.questions.map((item) => ({ item, entry: entries.get(item.key) })).filter((x) => x.entry);
  const sumgrades = slots.reduce((s, x) => s + (x.item.mark || 0), 0);
  const grade = sumgrades > 0 ? sumgrades : 0;
  const instances = slots.map((x, i) => `      <question_instance id="${alloc()}">
        <quizid>${qz.instanceId}</quizid>
        <slot>${i + 1}</slot>
        <page>1</page>
        <displaynumber>${NULL}</displaynumber>
        <requireprevious>0</requireprevious>
        <maxmark>${(x.item.mark || 0).toFixed(7)}</maxmark>
        <quizgradeitemid>${NULL}</quizgradeitemid>
        <question_reference id="${alloc()}">
          <usingcontextid>${qz.ctxId}</usingcontextid>
          <component>mod_quiz</component>
          <questionarea>slot</questionarea>
          <questionbankentryid>${entries.get(x.item.key)!.entryId}</questionbankentryid>
          <version>${NULL}</version>
        </question_reference>
      </question_instance>`).join("\n");
  return HEAD + `<activity id="${qz.instanceId}" moduleid="${qz.cmid}" modulename="quiz" contextid="${qz.ctxId}">
  <quiz id="${qz.instanceId}">
    <name>${esc(qz.title)}</name>
    <intro>${esc(qz.intro)}</intro>
    <introformat>1</introformat>
    <timeopen>0</timeopen>
    <timeclose>0</timeclose>
    <timelimit>0</timelimit>
    <overduehandling>autosubmit</overduehandling>
    <graceperiod>0</graceperiod>
    <preferredbehaviour>deferredfeedback</preferredbehaviour>
    <canredoquestions>0</canredoquestions>
    <attempts_number>0</attempts_number>
    <attemptonlast>0</attemptonlast>
    <grademethod>1</grademethod>
    <decimalpoints>2</decimalpoints>
    <questiondecimalpoints>-1</questiondecimalpoints>
    <reviewattempt>69888</reviewattempt>
    <reviewcorrectness>69888</reviewcorrectness>
    <reviewmaxmarks>69888</reviewmaxmarks>
    <reviewmarks>69888</reviewmarks>
    <reviewspecificfeedback>69888</reviewspecificfeedback>
    <reviewgeneralfeedback>69888</reviewgeneralfeedback>
    <reviewrightanswer>69888</reviewrightanswer>
    <reviewoverallfeedback>4352</reviewoverallfeedback>
    <questionsperpage>1</questionsperpage>
    <navmethod>free</navmethod>
    <shuffleanswers>1</shuffleanswers>
    <sumgrades>${grade.toFixed(5)}</sumgrades>
    <grade>${grade.toFixed(5)}</grade>
    <timecreated>${now}</timecreated>
    <timemodified>${now}</timemodified>
    <password></password>
    <subnet></subnet>
    <browsersecurity>-</browsersecurity>
    <delay1>0</delay1>
    <delay2>0</delay2>
    <showuserpicture>0</showuserpicture>
    <showblocks>0</showblocks>
    <completionattemptsexhausted>0</completionattemptsexhausted>
    <completionminattempts>0</completionminattempts>
    <allowofflineattempts>0</allowofflineattempts>
    <subplugin_quizaccess_seb_quiz>
    </subplugin_quizaccess_seb_quiz>
    <quiz_grade_items>
    </quiz_grade_items>
    <question_instances>
${instances}
    </question_instances>
    <sections>
      <section id="${alloc()}">
        <firstslot>1</firstslot>
        <heading></heading>
        <shufflequestions>0</shufflequestions>
      </section>
    </sections>
    <feedbacks>
    </feedbacks>
    <overrides>
    </overrides>
    <grades>
    </grades>
    <attempts>
    </attempts>
  </quiz>
</activity>`;
}

function quizGradesXml(qz: QuizNode, catId: number, now: number): string {
  const grade = qz.questions.reduce((s, x) => s + (x.mark || 0), 0);
  return HEAD + `<activity_gradebook>
  <grade_items>
    <grade_item id="${qz.gradeItemId}">
      <categoryid>${catId}</categoryid>
      <itemname>${esc(qz.title)}</itemname>
      <itemtype>mod</itemtype>
      <itemmodule>quiz</itemmodule>
      <iteminstance>${qz.instanceId}</iteminstance>
      <itemnumber>0</itemnumber>
      <iteminfo>${NULL}</iteminfo>
      <idnumber>${NULL}</idnumber>
      <calculation>${NULL}</calculation>
      <gradetype>1</gradetype>
      <grademax>${(grade > 0 ? grade : 0).toFixed(5)}</grademax>
      <grademin>0.00000</grademin>
      <scaleid>${NULL}</scaleid>
      <outcomeid>${NULL}</outcomeid>
      <gradepass>0.00000</gradepass>
      <multfactor>1.00000</multfactor>
      <plusfactor>0.00000</plusfactor>
      <aggregationcoef>0.00000</aggregationcoef>
      <aggregationcoef2>0.00000</aggregationcoef2>
      <weightoverride>0</weightoverride>
      <sortorder>2</sortorder>
      <display>0</display>
      <decimals>${NULL}</decimals>
      <hidden>0</hidden>
      <locked>0</locked>
      <locktime>0</locktime>
      <needsupdate>0</needsupdate>
      <timecreated>${now}</timecreated>
      <timemodified>${now}</timemodified>
      <grade_grades>
      </grade_grades>
    </grade_item>
  </grade_items>
  <grade_letters>
  </grade_letters>
</activity_gradebook>`;
}

function quizInforefXml(qz: QuizNode, categoryId: number): string {
  return HEAD + `<inforef>
  <grade_itemref>
    <grade_item>
      <id>${qz.gradeItemId}</id>
    </grade_item>
  </grade_itemref>
  <question_categoryref>
    <question_category>
      <id>${categoryId}</id>
    </question_category>
  </question_categoryref>
</inforef>`;
}

/* ----------------------------- Sections ----------------------------- */
function sectionXml(s: SectionNode, now: number): string {
  const seq = [...s.pages.map((p) => p.cmid), ...s.quizzes.map((q) => q.cmid)].join(",");
  return HEAD + `<section id="${s.id}">
  <number>${s.number}</number>
  <name>${s.name ? esc(s.name) : NULL}</name>
  <summary>${esc(s.summary)}</summary>
  <summaryformat>1</summaryformat>
  <sequence>${seq}</sequence>
  <visible>1</visible>
  <availabilityjson>${NULL}</availabilityjson>
  <component>${NULL}</component>
  <itemid>${NULL}</itemid>
  <timemodified>${now}</timemodified>
</section>`;
}
const SECTION_INFOREF = HEAD + "<inforef>\n</inforef>";

/* ----------------------------- Cours ----------------------------- */
function courseXml(c: MbzCourse, courseId: number, ctxId: number, now: number): string {
  return HEAD + `<course id="${courseId}" contextid="${ctxId}">
  <shortname>${esc(c.shortname)}</shortname>
  <fullname>${esc(c.fullname)}</fullname>
  <idnumber></idnumber>
  <summary>${esc(c.summary ?? "")}</summary>
  <summaryformat>1</summaryformat>
  <format>topics</format>
  <showgrades>1</showgrades>
  <newsitems>0</newsitems>
  <startdate>${now}</startdate>
  <enddate>0</enddate>
  <marker>0</marker>
  <maxbytes>0</maxbytes>
  <legacyfiles>0</legacyfiles>
  <showreports>0</showreports>
  <visible>1</visible>
  <groupmode>0</groupmode>
  <groupmodeforce>0</groupmodeforce>
  <defaultgroupingid>0</defaultgroupingid>
  <lang></lang>
  <theme></theme>
  <timecreated>${now}</timecreated>
  <timemodified>${now}</timemodified>
  <requested>0</requested>
  <showactivitydates>1</showactivitydates>
  <showcompletionconditions>${NULL}</showcompletionconditions>
  <pdfexportfont>${NULL}</pdfexportfont>
  <enablecompletion>0</enablecompletion>
  <completionnotify>0</completionnotify>
  <category id="1">
    <name>Divers</name>
    <description>${NULL}</description>
  </category>
  <tags>
  </tags>
  <customfields>
  </customfields>
  <courseformatoptions>
    <courseformatoption>
      <format>topics</format>
      <sectionid>0</sectionid>
      <name>hiddensections</name>
      <value>1</value>
    </courseformatoption>
    <courseformatoption>
      <format>topics</format>
      <sectionid>0</sectionid>
      <name>coursedisplay</name>
      <value>0</value>
    </courseformatoption>
  </courseformatoptions>
</course>`;
}

function courseInforef(categoryId: number | null): string {
  const catRef = categoryId ? `\n  <question_categoryref>\n    <question_category>\n      <id>${categoryId}</id>\n    </question_category>\n  </question_categoryref>` : "";
  return HEAD + `<inforef>\n  <roleref>\n    <role>\n      <id>${STUDENT_ROLE_ID}</id>\n    </role>\n  </roleref>${catRef}\n</inforef>`;
}
const COURSE_ROLES = PAGE_ROLES;
const COURSE_COMPLETIONDEFAULTS = HEAD + "<course_completion_defaults>\n</course_completion_defaults>";
const COURSE_CALENDAR = HEAD + "<events>\n</events>";
const COURSE_FILTERS = PAGE_FILTERS;
const COURSE_COMPETENCIES = HEAD + "<course_competencies>\n  <competencies>\n  </competencies>\n  <user_competencies>\n  </user_competencies>\n</course_competencies>";
const COURSE_CONTENTBANK = HEAD + "<contents>\n</contents>";

function enrolXml(id: number, type: string, roleid: number, status: number, now: number): string {
  return `    <enrol id="${id}">
      <enrol>${type}</enrol>
      <status>${status}</status>
      <name>${NULL}</name>
      <enrolperiod>0</enrolperiod>
      <enrolstartdate>0</enrolstartdate>
      <enrolenddate>0</enrolenddate>
      <expirynotify>0</expirynotify>
      <expirythreshold>86400</expirythreshold>
      <notifyall>0</notifyall>
      <password>${NULL}</password>
      <cost>${NULL}</cost>
      <currency>${NULL}</currency>
      <roleid>${roleid}</roleid>
      <customint1>${NULL}</customint1>
      <customint2>${NULL}</customint2>
      <customint3>${NULL}</customint3>
      <customint4>${NULL}</customint4>
      <customint5>${NULL}</customint5>
      <customint6>${NULL}</customint6>
      <customint7>${NULL}</customint7>
      <customint8>${NULL}</customint8>
      <customchar1>${NULL}</customchar1>
      <customchar2>${NULL}</customchar2>
      <customchar3>${NULL}</customchar3>
      <customdec1>${NULL}</customdec1>
      <customdec2>${NULL}</customdec2>
      <customtext1>${NULL}</customtext1>
      <customtext2>${NULL}</customtext2>
      <customtext3>${NULL}</customtext3>
      <customtext4>${NULL}</customtext4>
      <timecreated>${now}</timecreated>
      <timemodified>${now}</timemodified>
      <user_enrolments>
      </user_enrolments>
    </enrol>`;
}
function courseEnrolments(now: number, idA: number, idB: number, idC: number): string {
  return HEAD + `<enrolments>
  <enrols>
${enrolXml(idA, "manual", STUDENT_ROLE_ID, 0, now)}
${enrolXml(idB, "guest", 0, 1, now)}
${enrolXml(idC, "self", STUDENT_ROLE_ID, 1, now)}
  </enrols>
</enrolments>`;
}

/* ----------------------------- Fichiers racine ----------------------------- */
const ROOT_ROLES = HEAD + `<roles_definition>
  <role id="${STUDENT_ROLE_ID}">
    <name></name>
    <shortname>student</shortname>
    <nameincourse>${NULL}</nameincourse>
    <description></description>
    <sortorder>5</sortorder>
    <archetype>student</archetype>
  </role>
</roles_definition>`;
const ROOT_SCALES = HEAD + "<scales_definition>\n</scales_definition>";
const ROOT_OUTCOMES = HEAD + "<outcomes_definition>\n</outcomes_definition>";
const ROOT_GROUPS = HEAD + "<groups>\n  <groupcustomfields>\n  </groupcustomfields>\n  <groupings>\n    <groupingcustomfields>\n    </groupingcustomfields>\n  </groupings>\n</groups>";
const ROOT_GRADE_HISTORY = PAGE_GRADE_HISTORY;
const ROOT_COMPLETION = HEAD + "<course_completion>\n</course_completion>";
const ROOT_BADGES = HEAD + "<badges>\n</badges>";
const ROOT_FILES = HEAD + "<files>\n</files>";

function gradebookXml(courseId: number, catId: number, itemId: number, now: number): string {
  return HEAD + `<gradebook>
  <attributes>
  </attributes>
  <grade_categories>
    <grade_category id="${catId}">
      <parent>${NULL}</parent>
      <depth>1</depth>
      <path>/${catId}/</path>
      <fullname>?</fullname>
      <aggregation>13</aggregation>
      <keephigh>0</keephigh>
      <droplow>0</droplow>
      <aggregateonlygraded>1</aggregateonlygraded>
      <aggregateoutcomes>0</aggregateoutcomes>
      <timecreated>${now}</timecreated>
      <timemodified>${now}</timemodified>
      <hidden>0</hidden>
    </grade_category>
  </grade_categories>
  <grade_items>
    <grade_item id="${itemId}">
      <categoryid>${NULL}</categoryid>
      <itemname>${NULL}</itemname>
      <itemtype>course</itemtype>
      <itemmodule>${NULL}</itemmodule>
      <iteminstance>${courseId}</iteminstance>
      <itemnumber>${NULL}</itemnumber>
      <iteminfo>${NULL}</iteminfo>
      <idnumber>${NULL}</idnumber>
      <calculation>${NULL}</calculation>
      <gradetype>1</gradetype>
      <grademax>100.00000</grademax>
      <grademin>0.00000</grademin>
      <scaleid>${NULL}</scaleid>
      <outcomeid>${NULL}</outcomeid>
      <gradepass>0.00000</gradepass>
      <multfactor>1.00000</multfactor>
      <plusfactor>0.00000</plusfactor>
      <aggregationcoef>0.00000</aggregationcoef>
      <aggregationcoef2>0.00000</aggregationcoef2>
      <weightoverride>0</weightoverride>
      <sortorder>1</sortorder>
      <display>0</display>
      <decimals>${NULL}</decimals>
      <hidden>0</hidden>
      <locked>0</locked>
      <locktime>0</locktime>
      <needsupdate>0</needsupdate>
      <timecreated>${now}</timecreated>
      <timemodified>${now}</timemodified>
      <grade_grades>
      </grade_grades>
    </grade_item>
  </grade_items>
  <grade_letters>
  </grade_letters>
  <grade_settings>
    <grade_setting id="">
      <name>minmaxtouse</name>
      <value>1</value>
    </grade_setting>
  </grade_settings>
</gradebook>`;
}

/* ----------------------------- moodle_backup.xml ----------------------------- */
const ROOT_SETTINGS: [string, string][] = [
  ["users", "0"], ["anonymize", "0"], ["role_assignments", "0"], ["activities", "1"], ["blocks", "1"],
  ["files", "1"], ["filters", "1"], ["comments", "0"], ["badges", "1"], ["calendarevents", "1"],
  ["userscompletion", "0"], ["logs", "0"], ["grade_histories", "0"], ["questionbank", "1"], ["groups", "1"],
  ["competencies", "1"], ["customfield", "1"], ["contentbankcontent", "1"], ["xapistate", "0"], ["legacyfiles", "1"],
];

function moodleBackupXml(c: MbzCourse, courseId: number, courseCtx: number, sections: SectionNode[], filename: string, now: number, backupId: string): string {
  const setting = (level: string, name: string, value: string, extra = "") => `      <setting>\n        <level>${level}</level>\n${extra}        <name>${name}</name>\n        <value>${value}</value>\n      </setting>`;
  const pageAct = sections.flatMap((s) => s.pages).map((p) => `        <activity>
          <moduleid>${p.cmid}</moduleid>
          <sectionid>${p.sectionId}</sectionid>
          <modulename>page</modulename>
          <title>${esc(p.title)}</title>
          <directory>activities/page_${p.cmid}</directory>
          <insubsection></insubsection>
        </activity>`);
  const quizAct = sections.flatMap((s) => s.quizzes).map((q) => `        <activity>
          <moduleid>${q.cmid}</moduleid>
          <sectionid>${q.sectionId}</sectionid>
          <modulename>quiz</modulename>
          <title>${esc(q.title)}</title>
          <directory>activities/quiz_${q.cmid}</directory>
          <insubsection></insubsection>
        </activity>`);
  const activitiesXml = [...pageAct, ...quizAct].join("\n");
  const sectionsXml = sections.map((s) => `        <section>
          <sectionid>${s.id}</sectionid>
          <title>${s.name ? esc(s.name) : String(s.number)}</title>
          <directory>sections/section_${s.id}</directory>
          <parentcmid></parentcmid>
          <modname></modname>
        </section>`).join("\n");
  const settings: string[] = [setting("root", "filename", esc(filename))];
  for (const [n, v] of ROOT_SETTINGS) settings.push(setting("root", n, v));
  for (const s of sections) {
    settings.push(setting("section", `section_${s.id}_included`, "1", `        <section>section_${s.id}</section>\n`));
    settings.push(setting("section", `section_${s.id}_userinfo`, "0", `        <section>section_${s.id}</section>\n`));
    for (const p of s.pages) {
      settings.push(setting("activity", `page_${p.cmid}_included`, "1", `        <activity>page_${p.cmid}</activity>\n`));
      settings.push(setting("activity", `page_${p.cmid}_userinfo`, "0", `        <activity>page_${p.cmid}</activity>\n`));
    }
    for (const q of s.quizzes) {
      settings.push(setting("activity", `quiz_${q.cmid}_included`, "1", `        <activity>quiz_${q.cmid}</activity>\n`));
      settings.push(setting("activity", `quiz_${q.cmid}_userinfo`, "0", `        <activity>quiz_${q.cmid}</activity>\n`));
    }
  }
  return HEAD + `<moodle_backup>
  <information>
    <name>${esc(filename)}</name>
    <moodle_version>${MOODLE_VERSION}</moodle_version>
    <moodle_release>${MOODLE_RELEASE}</moodle_release>
    <backup_version>${BACKUP_VERSION}</backup_version>
    <backup_release>${BACKUP_RELEASE}</backup_release>
    <backup_date>${now}</backup_date>
    <mnet_remoteusers>0</mnet_remoteusers>
    <include_files>1</include_files>
    <include_file_references_to_external_content>0</include_file_references_to_external_content>
    <original_wwwroot>https://booking.eduweb.ci</original_wwwroot>
    <original_site_identifier_hash>${backupId}</original_site_identifier_hash>
    <original_course_id>${courseId}</original_course_id>
    <original_course_format>topics</original_course_format>
    <original_course_fullname>${esc(c.fullname)}</original_course_fullname>
    <original_course_shortname>${esc(c.shortname)}</original_course_shortname>
    <original_course_startdate>${now}</original_course_startdate>
    <original_course_enddate>0</original_course_enddate>
    <original_course_contextid>${courseCtx}</original_course_contextid>
    <original_system_contextid>1</original_system_contextid>
    <details>
      <detail backup_id="${backupId}">
        <type>course</type>
        <format>moodle2</format>
        <interactive>1</interactive>
        <mode>10</mode>
        <execution>1</execution>
        <executiontime>0</executiontime>
      </detail>
    </details>
    <contents>
      <activities>
${activitiesXml}
      </activities>
      <sections>
${sectionsXml}
      </sections>
      <course>
        <courseid>${courseId}</courseid>
        <title>${esc(c.shortname)}</title>
        <directory>course</directory>
      </course>
    </contents>
    <settings>
${settings.join("\n")}
    </settings>
  </information>
</moodle_backup>`;
}

/* ----------------------------- Assemblage ----------------------------- */
export function buildCourseMbz(c: MbzCourse, now: number): { filename: string; buffer: Buffer } {
  let seq = 1000;
  const nextId = () => seq++;
  const courseId = 2;
  const courseCtx = nextId();
  const backupId = (now.toString(16) + courseId.toString(16) + "00000000000000000000000000000000").slice(0, 32);

  // Section générale (0) + sections du cours (1..N)
  const sections: SectionNode[] = [{ id: nextId(), number: 0, name: null, summary: "", pages: [], quizzes: [] }];
  c.sections.forEach((s, i) => {
    const node: SectionNode = { id: nextId(), number: i + 1, name: s.title, summary: s.summary ?? "", pages: [], quizzes: [] };
    for (const p of s.pages) {
      node.pages.push({ cmid: nextId(), instanceId: nextId(), ctxId: nextId(), title: p.title, intro: p.intro ?? "", content: p.content, sectionId: node.id, sectionNumber: node.number });
    }
    for (const qz of s.quizzes ?? []) {
      node.quizzes.push({ cmid: nextId(), instanceId: nextId(), ctxId: nextId(), gradeItemId: nextId(), title: qz.title, intro: qz.intro ?? "", sectionId: node.id, sectionNumber: node.number, questions: qz.questions });
    }
    sections.push(node);
  });

  // Banque de questions partagée (questions.xml) : déduplique par clé sur toutes les questions des quiz.
  const allQuizzes = sections.flatMap((s) => s.quizzes);
  const courseGradeCat = nextId();
  const courseGradeItem = nextId();
  let questionBankXml = "";
  let categoryId: number | null = null;
  const bankEntries = new Map<string, { entryId: number; mark: number }>();
  if (allQuizzes.length) {
    categoryId = nextId();
    const seen = new Set<string>();
    const uniqueQuestions: { q: MbzQuestion; mark: number; key: string }[] = [];
    for (const qz of allQuizzes) for (const item of qz.questions) if (!seen.has(item.key)) { seen.add(item.key); uniqueQuestions.push(item); }
    const bank = buildQuestionBank(uniqueQuestions, categoryId, courseCtx, backupId, now, { next: nextId });
    questionBankXml = bank.xml;
    bank.entries.forEach((v, k) => bankEntries.set(k, v));
  }

  const filename = `eduweb-${c.shortname || "cours"}-${now}.mbz`.replace(/[^a-zA-Z0-9._-]/g, "-");
  const entries: { name: string; type: "file" | "dir"; content?: string }[] = [];
  const dir = (name: string) => entries.push({ name, type: "dir" });
  const file = (name: string, content: string) => entries.push({ name, type: "file", content });

  // Activités (pages)
  dir("activities");
  for (const s of sections) {
    for (const p of s.pages) {
      const d = `activities/page_${p.cmid}`;
      dir(d);
      file(`${d}/page.xml`, pageXml(p, now));
      file(`${d}/grades.xml`, PAGE_GRADES);
      file(`${d}/calendar.xml`, PAGE_CALENDAR);
      file(`${d}/roles.xml`, PAGE_ROLES);
      file(`${d}/grade_history.xml`, PAGE_GRADE_HISTORY);
      file(`${d}/filters.xml`, PAGE_FILTERS);
      file(`${d}/competencies.xml`, PAGE_COMPETENCIES);
      file(`${d}/inforef.xml`, PAGE_INFOREF);
      file(`${d}/module.xml`, moduleXml(p, now));
    }
    for (const qz of s.quizzes) {
      const d = `activities/quiz_${qz.cmid}`;
      dir(d);
      file(`${d}/quiz.xml`, quizActivityXml(qz, bankEntries, now, nextId));
      file(`${d}/grades.xml`, quizGradesXml(qz, courseGradeCat, now));
      file(`${d}/calendar.xml`, PAGE_CALENDAR);
      file(`${d}/roles.xml`, PAGE_ROLES);
      file(`${d}/grade_history.xml`, PAGE_GRADE_HISTORY);
      file(`${d}/filters.xml`, PAGE_FILTERS);
      file(`${d}/competencies.xml`, PAGE_COMPETENCIES);
      file(`${d}/inforef.xml`, categoryId ? quizInforefXml(qz, categoryId) : PAGE_INFOREF);
      file(`${d}/module.xml`, quizModuleXml(qz, now));
    }
  }
  // Cours
  dir("course");
  file("course/course.xml", courseXml(c, courseId, courseCtx, now));
  file("course/enrolments.xml", courseEnrolments(now, nextId(), nextId(), nextId()));
  file("course/inforef.xml", courseInforef(categoryId));
  file("course/roles.xml", COURSE_ROLES);
  file("course/completiondefaults.xml", COURSE_COMPLETIONDEFAULTS);
  file("course/calendar.xml", COURSE_CALENDAR);
  file("course/filters.xml", COURSE_FILTERS);
  file("course/competencies.xml", COURSE_COMPETENCIES);
  file("course/contentbank.xml", COURSE_CONTENTBANK);
  // Sections
  dir("sections");
  for (const s of sections) {
    const d = `sections/section_${s.id}`;
    dir(d);
    file(`${d}/section.xml`, sectionXml(s, now));
    file(`${d}/inforef.xml`, SECTION_INFOREF);
  }
  // Fichiers racine
  file("files.xml", ROOT_FILES);
  file("scales.xml", ROOT_SCALES);
  file("outcomes.xml", ROOT_OUTCOMES);
  file("roles.xml", ROOT_ROLES);
  file("groups.xml", ROOT_GROUPS);
  if (categoryId) file("questions.xml", questionBankXml);
  file("gradebook.xml", gradebookXml(courseId, courseGradeCat, courseGradeItem, now));
  file("grade_history.xml", ROOT_GRADE_HISTORY);
  file("completion.xml", ROOT_COMPLETION);
  file("badges.xml", ROOT_BADGES);
  file("moodle_backup.xml", moodleBackupXml(c, courseId, courseCtx, sections, filename, now, backupId));
  file("moodle_backup.log", "");

  // .ARCHIVE_INDEX (en tête) : "path\ttype\tsize\tmtime"
  const indexLines = [`Moodle archive file index. Count: ${entries.length}`];
  for (const e of entries) {
    if (e.type === "dir") indexLines.push(`${e.name}/\td\t0\t?`);
    else indexLines.push(`${e.name}\tf\t${Buffer.byteLength(e.content ?? "", "utf8")}\t${now}`); // taille en OCTETS (UTF-8), comme Moodle
  }
  const archiveIndex = indexLines.join("\n") + "\n";

  const tarEntries: TarEntry[] = [{ name: ".ARCHIVE_INDEX", type: "file", data: Buffer.from(archiveIndex, "utf8"), mtime: now }];
  for (const e of entries) {
    tarEntries.push(e.type === "dir"
      ? { name: e.name, type: "dir", mtime: now }
      : { name: e.name, type: "file", data: Buffer.from(e.content ?? "", "utf8"), mtime: now });
  }
  return { filename, buffer: buildTarGz(tarEntries) };
}
