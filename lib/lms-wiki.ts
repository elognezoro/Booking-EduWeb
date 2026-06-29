/** Réglages d'un wiki. Module neutre. */
export interface WikiConfig {
  allowStudentEdit: boolean; // les apprenants peuvent créer/modifier des pages
}

export const DEFAULT_WIKI_CONFIG: WikiConfig = { allowStudentEdit: true };

export function parseWikiConfig(json: string | null | undefined): WikiConfig {
  try {
    return { ...DEFAULT_WIKI_CONFIG, ...(json ? (JSON.parse(json) as Partial<WikiConfig>) : {}) };
  } catch {
    return { ...DEFAULT_WIKI_CONFIG };
  }
}
