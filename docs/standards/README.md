# EduWeb — Référentiels d'ingénierie (Standards)

Documents officiels de l'écosystème EduWeb, versionnés dans le dépôt. Toute nouvelle
fonctionnalité doit s'y conformer ; les écarts connus sont notés ci-dessous.

| Code | Document | Fichier |
|------|----------|---------|
| STD-010 | File Storage Standards | [STD-010-file-storage.md](./STD-010-file-storage.md) |
| STD-011 | API Standards | [STD-011-api.md](./STD-011-api.md) |
| STD-012 | Backend Standards | [STD-012-backend.md](./STD-012-backend.md) |

## État de conformité (au moment de l'ajout)

**STD-010 (Stockage de fichiers) — écart majeur connu.** Le projet stocke actuellement
plusieurs fichiers **en base64 dans Neon**, ce que le standard interdit
(§2 Philosophie, §18 Anti-pattern « Stocker des fichiers dans Neon ») :
`CertificateConfig.signatureImage` / `stampImage`, `LmsSubmission.fileData` (devoirs),
la config certificat CERTEL (`signatureDataUrl` / `cachetDataUrl` dans `PlatformSetting`),
et potentiellement `Organization.logoUrl`. Choix initial de simplicité (aucun stockage
objet à provisionner). La mise en conformité suppose de choisir un service compatible S3
(Cloudflare R2 recommandé, ou AWS S3) + URL signées + validation MIME/taille centralisée.

**STD-011 (API) — largement respecté dans l'esprit.** Server Actions pour l'interne,
Route Handlers réservés aux fichiers/webhooks/exports, routes basées sur les ressources
(aucun verbe dans les chemins), RBAC via `requirePermission`, Zod sur les entrées
sensibles. Écarts : pas d'enveloppe de réponse `{success,data,error}` normalisée (les
Server Actions renvoient/redirigent), pas de doc OpenAPI, pas de rate-limiting explicite,
pagination ad hoc.
