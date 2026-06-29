/** Réglages d'un devoir (dépôt) + bornes. Module neutre (réutilisable client/serveur). */
export interface AssignConfig {
  dueAt: string | null; // ISO (date/heure limite) ou null
  allowText: boolean; // remise par texte en ligne
  allowFile: boolean; // remise par fichier joint
  maxFileMb: number; // taille max d'un fichier (Mo)
  maxGrade: number; // note maximale
  allowLate: boolean; // autoriser la remise en retard
}

export const ASSIGN_MAX_FILE_MB = 8; // plafond dur (cf. bodySizeLimit 12mb)

export const DEFAULT_ASSIGN_CONFIG: AssignConfig = {
  dueAt: null, allowText: true, allowFile: true, maxFileMb: 5, maxGrade: 20, allowLate: true,
};

export function parseAssignConfig(json: string | null | undefined): AssignConfig {
  try {
    return { ...DEFAULT_ASSIGN_CONFIG, ...(json ? (JSON.parse(json) as Partial<AssignConfig>) : {}) };
  } catch {
    return { ...DEFAULT_ASSIGN_CONFIG };
  }
}

/** Types de fichiers acceptés (attribut accept + validation indicative). */
export const ASSIGN_ACCEPT = ".pdf,.doc,.docx,.odt,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.zip,.png,.jpg,.jpeg,.webp,.gif";

/** Extensions autorisées (liste blanche appliquée AUSSI côté serveur). */
export const ASSIGN_ALLOWED_EXT = ["pdf", "doc", "docx", "odt", "ppt", "pptx", "xls", "xlsx", "txt", "csv", "zip", "png", "jpg", "jpeg", "webp", "gif"];

/** L'extension du nom de fichier est-elle dans la liste blanche ? (défense serveur) */
export function isAllowedFile(fileName: string): boolean {
  const ext = fileName.toLowerCase().split(".").pop() ?? "";
  return ASSIGN_ALLOWED_EXT.includes(ext);
}

/** La remise est-elle en retard par rapport à la date limite ? */
export function isLate(config: AssignConfig, submittedAt: Date | string): boolean {
  if (!config.dueAt) return false;
  const due = new Date(config.dueAt).getTime();
  const at = new Date(submittedAt).getTime();
  return Number.isFinite(due) && Number.isFinite(at) && at > due;
}

/** Taille approximative (octets) d'un contenu encodé en data URL base64. */
export function dataUrlBytes(dataUrl: string): number {
  const i = dataUrl.indexOf(",");
  const b64 = i >= 0 ? dataUrl.slice(i + 1) : dataUrl;
  const padding = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((b64.length * 3) / 4) - padding);
}

/** Libellé d'une taille de fichier. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}
