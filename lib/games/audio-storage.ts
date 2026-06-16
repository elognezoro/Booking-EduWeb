import "server-only";
import { promises as fs } from "fs";
import path from "path";

const DIR = path.join(process.cwd(), "storage", "brain-audio");

export async function saveGameAudio(slug: string, buffer: Buffer, ext: string): Promise<string> {
  await fs.mkdir(DIR, { recursive: true });
  const safe = slug.replace(/[^a-z0-9-]/gi, "");
  const rel = `${safe}.${ext}`;
  await fs.writeFile(path.join(DIR, rel), buffer);
  return rel;
}

export function readGameAudio(rel: string): Promise<Buffer> {
  return fs.readFile(path.join(DIR, path.basename(rel)));
}

export async function deleteGameAudio(rel: string): Promise<void> {
  await fs.rm(path.join(DIR, path.basename(rel))).catch(() => {});
}

export function audioMime(rel: string): string {
  const ext = rel.split(".").pop()?.toLowerCase();
  return ext === "mp3" ? "audio/mpeg" : ext === "ogg" ? "audio/ogg" : ext === "wav" ? "audio/wav" : ext === "m4a" ? "audio/mp4" : "application/octet-stream";
}
