/** Réglages d'un forum. Module neutre. */
export interface ForumConfig {
  allowStudentDiscussions: boolean; // les apprenants peuvent ouvrir de nouvelles discussions
}

export const DEFAULT_FORUM_CONFIG: ForumConfig = { allowStudentDiscussions: true };

export function parseForumConfig(json: string | null | undefined): ForumConfig {
  try {
    return { ...DEFAULT_FORUM_CONFIG, ...(json ? (JSON.parse(json) as Partial<ForumConfig>) : {}) };
  } catch {
    return { ...DEFAULT_FORUM_CONFIG };
  }
}
