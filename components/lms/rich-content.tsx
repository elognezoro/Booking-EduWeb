/** Styles d'affichage du contenu enrichi LMS (titres, listes, liens, images, citations). */
export const LMS_PROSE =
  "max-w-none text-sm leading-relaxed text-foreground " +
  "[&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground " +
  "[&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-bold " +
  "[&_h4]:mt-2 [&_h4]:font-bold " +
  "[&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-0.5 " +
  "[&_a]:text-primary [&_a]:underline [&_img]:my-3 [&_img]:max-w-full [&_img]:rounded-lg " +
  "[&_blockquote]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground " +
  "[&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-secondary [&_pre]:p-3 [&_code]:rounded [&_code]:bg-secondary [&_code]:px-1 " +
  "[&_table]:my-2 [&_table]:w-full [&_td]:border [&_td]:border-border [&_td]:p-1.5 [&_th]:border [&_th]:border-border [&_th]:bg-secondary [&_th]:p-1.5";

/** Rend du HTML déjà nettoyé (sanitizeRich côté serveur). */
export function RichContent({ html, className }: { html: string; className?: string }) {
  return <div className={`${LMS_PROSE} ${className ?? ""}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
