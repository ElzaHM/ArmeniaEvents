import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const ROOT = join(import.meta.dirname, '..', 'src');
const BLUR_LINES = [
  '  transform: translateZ(0);',
  '  -webkit-transform: translateZ(0);',
  '  -webkit-backdrop-filter: blur(16px) saturate(1.8) !important;',
  '  backdrop-filter: blur(16px) saturate(1.8) !important;',
];

const STRIP_RE =
  /\s*(?:transform\s*:\s*translateZ\(0\)|-webkit-transform\s*:\s*translateZ\(0\)|-webkit-backdrop-filter\s*:[^;]+|backdrop-filter\s*:[^;]+)\s*;?/g;

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (name.endsWith('.css')) files.push(full);
  }
  return files;
}

function hasActiveBlur(body) {
  const lines = body.match(/-webkit-backdrop-filter\s*:[^;]+;|backdrop-filter\s*:[^;]+;/g) ?? [];
  return lines.some((line) => !/:\s*none(\s*!important)?\s*;/.test(line));
}

function processRuleBody(body) {
  if (!hasActiveBlur(body)) return body;

  const cleaned = body.replace(STRIP_RE, '').replace(/\n{3,}/g, '\n\n').trimEnd();
  const indent = cleaned.length ? `${cleaned}\n` : '';
  return `${indent}${BLUR_LINES.join('\n')}\n`;
}

function processCss(css) {
  let result = '';
  let i = 0;

  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open === -1) {
      result += css.slice(i);
      break;
    }

    result += css.slice(i, open + 1);
    let depth = 1;
    let j = open + 1;

    while (j < css.length && depth > 0) {
      if (css[j] === '{') depth += 1;
      else if (css[j] === '}') depth -= 1;
      j += 1;
    }

    const body = css.slice(open + 1, j - 1);
    const selectorStart = result.lastIndexOf('{', result.length - 1);
    const selector = result.slice(0, selectorStart).split('\n').pop() ?? '';

    if (selector.trim().startsWith('@')) {
      result += processCss(body);
    } else {
      result += processRuleBody(body);
    }

    result += '}';
    i = j;
  }

  return result;
}

let updated = 0;

for (const file of walk(ROOT)) {
  const original = readFileSync(file, 'utf8');
  const next = processCss(original);
  if (next !== original) {
    writeFileSync(file, next, 'utf8');
    updated += 1;
    console.log(relative(join(import.meta.dirname, '..'), file));
  }
}

console.log(`Updated ${updated} file(s).`);
