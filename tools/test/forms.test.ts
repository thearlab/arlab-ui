import { describe, expect, it } from 'vitest';
import { clampNumber, stepNumber, acceptsFile, checkFiles, timeSteps } from '../../src/lib/forms';

describe('numbers', () => {
  it('clamps and snaps to the step', () => {
    expect(clampNumber(12, 0, 10)).toBe(10);
    expect(clampNumber(-3, 0, 10)).toBe(0);
    expect(clampNumber(0.3000004, 0, 1, 0.1)).toBe(0.3);
    expect(clampNumber(7, 1, 100, 5)).toBe(6);
    expect(Number.isNaN(clampNumber(NaN))).toBe(true);
  });
  it('steps from empty and within bounds', () => {
    expect(stepNumber(null, 1, 1, 0, 10)).toBe(0);
    expect(stepNumber(9, 1, 2, 0, 10)).toBe(10);
    expect(stepNumber(0, -1, 1, 0, 10)).toBe(0);
    expect(stepNumber(1.5, 1, 0.5)).toBe(2);
  });
});

describe('files', () => {
  const png = { name: 'a.PNG', type: 'image/png', size: 2048 };
  const pdf = { name: 'b.pdf', type: 'application/pdf', size: 5_000_000 };
  it('matches accept strings', () => {
    expect(acceptsFile(png, 'image/*')).toBe(true);
    expect(acceptsFile(png, '.png')).toBe(true);
    expect(acceptsFile(pdf, 'image/*,video/mp4')).toBe(false);
    expect(acceptsFile(pdf, '')).toBe(true);
  });
  it('explains what it leaves out', () => {
    const r = checkFiles([png, pdf], { accept: 'image/*,.pdf', maxSize: 1_000_000 });
    expect(r.ok).toEqual([png]);
    expect(r.errors[0]).toMatch(/b\.pdf is 4\.8 MB, over the 977 KB limit/);
    const m = checkFiles([png, png], { maxFiles: 2, current: 1 });
    expect(m.ok.length).toBe(1);
    expect(m.errors[0]).toMatch(/2 files at most/);
  });
});

describe('time steps', () => {
  it('lists the day in steps', () => {
    expect(timeSteps(30).length).toBe(48);
    expect(timeSteps(15, '09:00', '10:00')).toEqual(['09:00', '09:15', '09:30', '09:45', '10:00']);
  });
});

import { acceptWords } from '../../src/lib/forms';
describe('acceptWords', () => {
  it('says the accept string in words', () => {
    expect(acceptWords('image/*,video/*')).toBe('images and videos');
    expect(acceptWords('image/*,video/mp4,.pdf')).toBe('images, MP4 videos and PDF files');
    expect(acceptWords('application/pdf')).toBe('PDF files');
    expect(acceptWords('')).toBe('');
  });
});
