// Pure logic behind the form controls: number stepping and clamping, file checks, time steps.
// Unit tested in tools/test/forms.test.ts.
import { bytes } from './format';

/** Round to the step's precision, then keep within min and max. NaN stays NaN. */
export function clampNumber(n: number, min = -Infinity, max = Infinity, step?: number): number {
  if (Number.isNaN(n)) return n;
  let v = n;
  if (step && step > 0) {
    const base = Number.isFinite(min) ? min : 0;
    const dp = (String(step).split('.')[1] || '').length;
    v = +(Math.round((v - base) / step) * step + base).toFixed(dp);
  }
  return Math.min(max, Math.max(min, v));
}

/** One step up or down from a value that may be empty. */
export function stepNumber(current: number | null, dir: 1 | -1, step = 1, min = -Infinity, max = Infinity): number {
  const start = current === null || Number.isNaN(current) ? (Number.isFinite(min) ? min : 0) : current + dir * step;
  return clampNumber(start, min, max, step);
}

/** Does a file match an accept string ("image/*,.pdf,video/mp4")? Empty accept takes anything. */
export function acceptsFile(f: { name: string; type: string }, accept?: string): boolean {
  if (!accept) return true;
  const name = f.name.toLowerCase(), type = (f.type || '').toLowerCase();
  return accept.split(',').map((a) => a.trim().toLowerCase()).filter(Boolean).some((a) =>
    a.startsWith('.') ? name.endsWith(a) : a.endsWith('/*') ? type.startsWith(a.slice(0, -1)) : type === a);
}

export interface FileRules { accept?: string; maxSize?: number; maxFiles?: number; current?: number }
export interface FileCheck<F> { ok: F[]; errors: string[] }

/** Split picked files into the ones that pass and plain-words reasons for the ones that do not. */
export function checkFiles<F extends { name: string; type: string; size: number }>(files: F[], rules: FileRules = {}): FileCheck<F> {
  const ok: F[] = [], errors: string[] = [];
  const room = rules.maxFiles === undefined ? Infinity : rules.maxFiles - (rules.current ?? 0);
  for (const f of files) {
    if (!acceptsFile(f, rules.accept)) errors.push(`${f.name} is not a file type this takes.`);
    else if (rules.maxSize !== undefined && f.size > rules.maxSize) errors.push(`${f.name} is ${bytes(f.size)}, over the ${bytes(rules.maxSize)} limit.`);
    else if (ok.length >= room) errors.push(`${f.name} was left out: ${rules.maxFiles} ${rules.maxFiles === 1 ? 'file' : 'files'} at most.`);
    else ok.push(f);
  }
  return { ok, errors };
}

/** 'HH:MM' times from start to end (inclusive) every `step` minutes. */
export function timeSteps(step = 30, start = '00:00', end = '23:59'): string[] {
  const toMin = (t: string) => +t.slice(0, 2) * 60 + +t.slice(3, 5);
  const out: string[] = [];
  for (let m = toMin(start); m <= toMin(end); m += step) out.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
  return out;
}

/** An accept string in plain words: "image/*,video/mp4,.pdf" -> "images, MP4 videos and PDF files". */
export function acceptWords(accept?: string): string {
  if (!accept) return '';
  const words = accept.split(',').map((a) => a.trim().toLowerCase()).filter(Boolean).map((a) => {
    if (a.endsWith('/*')) return `${a.slice(0, -2)}s`.replace('applications', 'documents');
    if (a.startsWith('.')) return `${a.slice(1).toUpperCase()} files`;
    const [kind, sub] = a.split('/');
    return `${(sub || kind).replace(/^x-/, '').toUpperCase()} ${kind === 'application' ? 'files' : kind + 's'}`;
  });
  return words.length > 1 ? `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}` : words[0];
}
