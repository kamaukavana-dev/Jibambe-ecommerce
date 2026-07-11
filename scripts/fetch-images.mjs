/**
 * One-time image curation. Downloads each product photo from Unsplash and
 * commits it as a STATIC asset under public/products/<slug>-<n>.jpg. After this
 * runs, the app has zero runtime image dependency — next/image serves local
 * files at known dimensions (zero CLS). Re-running skips files already present.
 *
 * Usage: node scripts/fetch-images.mjs
 */
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'public', 'products');
const SIZE = 900; // square source; next/image derives responsive srcset from it.

const manifest = JSON.parse(
  await readFile(join(__dirname, 'image-manifest.json'), 'utf8'),
);

await mkdir(outDir, { recursive: true });

const exists = async (p) =>
  access(p).then(
    () => true,
    () => false,
  );

let ok = 0;
let skipped = 0;
const failed = [];

for (const [slug, ids] of Object.entries(manifest)) {
  if (slug.startsWith('_')) continue;
  for (let i = 0; i < ids.length; i++) {
    const file = join(outDir, `${slug}-${i + 1}.jpg`);
    if (await exists(file)) {
      skipped++;
      continue;
    }
    const url = `https://images.unsplash.com/photo-${ids[i]}?w=${SIZE}&h=${SIZE}&fit=crop&crop=entropy&q=80&auto=format`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 2000) throw new Error(`suspiciously small (${buf.length}b)`);
      await writeFile(file, buf);
      ok++;
      process.stdout.write(`  ✓ ${slug}-${i + 1}.jpg (${(buf.length / 1024) | 0}KB)\n`);
    } catch (err) {
      failed.push({ file: `${slug}-${i + 1}.jpg`, error: String(err.message ?? err) });
      process.stdout.write(`  ✗ ${slug}-${i + 1}.jpg — ${err.message ?? err}\n`);
    }
  }
}

console.log(`\nDone. ${ok} downloaded, ${skipped} skipped, ${failed.length} failed.`);
if (failed.length) {
  console.log('Failures:');
  for (const f of failed) console.log(`  - ${f.file}: ${f.error}`);
  process.exitCode = 1;
}
