import { gzipSync } from "zlib";

/** Écriture d'archives tar (format ustar) + gzip, sans dépendance. Utilisé pour générer les .mbz Moodle. */
export interface TarEntry { name: string; type: "file" | "dir"; data?: Buffer; mtime: number }

function writeOctal(buf: Buffer, offset: number, length: number, value: number) {
  const s = value.toString(8).padStart(length - 1, "0") + "\0";
  buf.write(s, offset, length, "ascii");
}

function tarHeader(name: string, size: number, mtime: number, isDir: boolean): Buffer {
  if (Buffer.byteLength(name, "utf8") > 100) throw new Error(`Nom d'entrée tar trop long (>100 octets) : ${name}`); // ustar : pas de troncature silencieuse
  const h = Buffer.alloc(512);
  h.write(name, 0, 100, "utf8");
  writeOctal(h, 100, 8, isDir ? 0o755 : 0o644); // mode
  writeOctal(h, 108, 8, 0); // uid
  writeOctal(h, 116, 8, 0); // gid
  writeOctal(h, 124, 12, size); // size (octets)
  writeOctal(h, 136, 12, mtime); // mtime
  h.write("        ", 148, 8, "ascii"); // checksum : 8 espaces avant calcul
  h.write(isDir ? "5" : "0", 156, 1, "ascii"); // typeflag
  h.write("ustar\0", 257, 6, "ascii"); // magic
  h.write("00", 263, 2, "ascii"); // version
  let sum = 0;
  for (let i = 0; i < 512; i++) sum += h[i];
  h.write(sum.toString(8).padStart(6, "0") + "\0 ", 148, 8, "ascii");
  return h;
}

/** Assemble les entrées en une archive tar, puis gzip. Renvoie le Buffer .mbz. */
export function buildTarGz(entries: TarEntry[]): Buffer {
  const blocks: Buffer[] = [];
  for (const e of entries) {
    const isDir = e.type === "dir";
    const name = isDir && !e.name.endsWith("/") ? `${e.name}/` : e.name;
    const data = isDir ? Buffer.alloc(0) : (e.data ?? Buffer.alloc(0));
    blocks.push(tarHeader(name, data.length, e.mtime, isDir));
    if (!isDir && data.length > 0) {
      blocks.push(data);
      const pad = (512 - (data.length % 512)) % 512;
      if (pad) blocks.push(Buffer.alloc(pad));
    }
  }
  blocks.push(Buffer.alloc(1024)); // deux blocs nuls de fin
  return gzipSync(Buffer.concat(blocks));
}
