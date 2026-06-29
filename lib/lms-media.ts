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

/**
 * Construit l'URL d'intégration GeoGebra à partir d'un identifiant de matériel OU d'une URL geogebra.org.
 * Renvoie null si l'entrée n'est pas un matériel GeoGebra valide (autres hôtes refusés — anti-injection iframe).
 */
export function geogebraEmbed(input: string): string | null {
  const v = (input || "").trim();
  if (!v) return null;
  const build = (id: string) => `https://www.geogebra.org/material/iframe/id/${id}/width/800/height/600/border/888888/rc/false/ai/false/sdz/true/smb/false/stb/false/stbh/false/ld/false`;
  try {
    const u = new URL(v);
    if (u.hostname === "geogebra.org" || u.hostname.endsWith(".geogebra.org")) {
      const m = u.pathname.match(/\/(?:m|material\/iframe\/id|classic|calculator|graphing|geometry|3d)\/([A-Za-z0-9]+)/);
      return m ? build(m[1]) : null;
    }
    return null; // tout autre hôte est refusé
  } catch {
    // pas une URL → identifiant de matériel brut
    return /^[A-Za-z0-9]{3,40}$/.test(v) ? build(v) : null;
  }
}
