import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// Stockage local sécurisé (hors /public). En production : brancher S3/Cloudinary.
const STORAGE_ROOT = path.join(process.cwd(), "storage", "documents");

function sanitizeFileName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .slice(0, 120) || "document";
}

export interface StoredFile {
  fileKey: string;
  fileName: string;
  fileMime: string;
  fileSize: number;
  fileHash: string;
}

export async function saveDocumentFile(documentId: string, file: File): Promise<StoredFile> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileHash = crypto.createHash("sha256").update(buffer).digest("hex");
  const safeName = sanitizeFileName(file.name);
  const dir = path.join(STORAGE_ROOT, documentId);
  await fs.mkdir(dir, { recursive: true });
  const fullPath = path.join(dir, safeName);
  await fs.writeFile(fullPath, buffer);

  return {
    fileKey: path.posix.join(documentId, safeName),
    fileName: file.name,
    fileMime: file.type || "application/octet-stream",
    fileSize: buffer.byteLength,
    fileHash,
  };
}

export async function readDocumentFile(fileKey: string): Promise<Buffer> {
  const fullPath = path.join(STORAGE_ROOT, fileKey);
  // Empêche toute remontée hors du dossier de stockage.
  if (!path.resolve(fullPath).startsWith(path.resolve(STORAGE_ROOT))) {
    throw new Error("Chemin de fichier invalide.");
  }
  return fs.readFile(fullPath);
}

/** Calcule le hash d'un fichier sans le stocker (détection de doublon au dépôt). */
export async function hashFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return crypto.createHash("sha256").update(buffer).digest("hex");
}
