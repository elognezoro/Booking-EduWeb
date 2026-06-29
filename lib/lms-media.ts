/** Détection du type de média à partir d'une URL, pour l'affichage (embed). Module neutre (client/serveur). */
export interface DetectedMedia {
  kind: "youtube" | "vimeo" | "image" | "video" | "audio" | "pdf" | "iframe" | "link";
  src: string;
  /** URL d'intégration (iframe) le cas échéant. */
  embed?: string;
}

export function detectMedia(rawUrl: string): DetectedMedia {
  const url = (rawUrl || "").trim();
  const lower = url.toLowerCase();

  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return { kind: "youtube", src: url, embed: `https://www.youtube.com/embed/${yt[1]}` };

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { kind: "vimeo", src: url, embed: `https://player.vimeo.com/video/${vimeo[1]}` };

  if (/\.(png|jpe?g|gif|webp|svg|avif)(\?|$)/i.test(lower)) return { kind: "image", src: url };
  if (/\.(mp4|webm|ogv|mov)(\?|$)/i.test(lower)) return { kind: "video", src: url };
  if (/\.(mp3|wav|ogg|m4a)(\?|$)/i.test(lower)) return { kind: "audio", src: url };
  if (/\.pdf(\?|$)/i.test(lower)) return { kind: "pdf", src: url };

  return { kind: "link", src: url };
}
