// The tour's placement and first-visit maths, checked against the built output on every build.
// No test framework: plain asserts over dist/tourPlace.js (pure, no React), like check-css.mjs.
import assert from 'node:assert/strict';
import { placeTour, tourDue } from '../dist/tourPlace.js';

const W = 320, H = 160, VW = 1280, VH = 800;
const box = (left, top, width = 100, height = 32) => ({ left, top, width, height });

// Room below: goes under the target, arrow over its middle.
let s = placeTour(box(500, 100), W, H, VW, VH);
assert.equal(s.side, 'bottom'); assert.equal(s.y, 100 + 32 + 12);
assert.equal(s.x + s.arrow + 6, 550);

// No room below: the first side with room after bottom is right.
s = placeTour(box(500, 700), W, H, VW, VH);
assert.equal(s.side, 'right'); assert.equal(s.x, 600 + 12);

// Bottom-right corner: neither bottom nor right fits, so it flips to top.
s = placeTour(box(1170, 700), W, H, VW, VH);
assert.equal(s.side, 'top'); assert.equal(s.y, 700 - 12 - H);
assert.ok(s.x + W <= VW - 12, 'clamped inside the right edge');
assert.ok(s.arrow >= 14 && s.arrow <= W - 26, 'arrow stays on the card');

// A rail item at the top left: below it there is room, but the preferred side wins when it fits.
s = placeTour(box(12, 80, 220, 34), W, H, VW, VH, 'right');
assert.equal(s.side, 'right');
assert.ok(s.y >= 12, 'clamped inside the top edge');

// Phone: docked to the bottom with a 16px gutter, no arrow.
s = placeTour(box(10, 10), 343, H, 375, 667);
assert.deepEqual(s, { side: 'dock', x: 16, y: 667 - H - 16, arrow: 0 });

// First-visit rule: due until either copy reaches the version.
assert.equal(tourDue(1, undefined, 0), true);
assert.equal(tourDue(1, 1, 0), false);
assert.equal(tourDue(1, undefined, 1), false);
assert.equal(tourDue(2, 1, 1), true);

console.log('ok    tour: placement, flip, clamp, dock and first-visit rule');
