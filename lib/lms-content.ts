import "server-only";
import sanitizeHtmlLib from "sanitize-html";

/** Nettoie le HTML enrichi saisi par un enseignant avant stockage (anti-XSS, liste blanche). */
export function sanitizeRich(html: string): string {
  return sanitizeHtmlLib(html, {
    allowedTags: [
      "p", "br", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s",
      "ul", "ol", "li", "a", "img", "blockquote", "code", "pre", "hr",
      "table", "thead", "tbody", "tr", "th", "td", "div", "span",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["http", "https"] }, // pas de data: (vecteur XSS SVG/polyglot)
    transformTags: {
      a: sanitizeHtmlLib.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }),
    },
  }).trim();
}
