import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const ROOT = join(import.meta.dirname, '..', 'src');

const BLUR_BLOCK_RE =
  /\s*transform\s*:\s*translateZ\(0\)\s*;\s*-webkit-transform\s*:\s*translateZ\(0\)\s*;\s*-webkit-backdrop-filter\s*:[^;]+;\s*backdrop-filter\s*:[^;]+;\s*/g;

const ADMIN_RE = /[/\\]admin[/\\]|[/\\]admin\.|AdminLayout|components[/\\]admin[/\\]/i;

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (name.endsWith('.css')) files.push(full);
  }
  return files;
}

function isAdminFile(file) {
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  return ADMIN_RE.test(rel);
}

let updated = 0;

for (const file of walk(ROOT)) {
  if (file.endsWith('index.css')) continue;
  if (isAdminFile(file)) continue;

  const original = readFileSync(file, 'utf8');
  const next = original.replace(BLUR_BLOCK_RE, '\n').replace(/\n{3,}/g, '\n\n');

  if (next !== original) {
    writeFileSync(file, next, 'utf8');
    updated += 1;
    console.log(relative(join(import.meta.dirname, '..'), file));
  }
}

console.log(`Stripped blur from ${updated} public file(s).`);
