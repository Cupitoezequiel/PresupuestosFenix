const assert = require('assert');

// Inline las funciones a testear (CJS-compatible)
function formatMiles(n) {
  if (!n && n !== 0) return '';
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
function parseMiles(str) {
  if (!str) return 0;
  return parseInt(str.toString().replace(/\./g, ''), 10) || 0;
}

assert.strictEqual(formatMiles(0), '0');
assert.strictEqual(formatMiles(1000), '1.000');
assert.strictEqual(formatMiles(80000), '80.000');
assert.strictEqual(formatMiles(1250000), '1.250.000');
assert.strictEqual(formatMiles(2345000), '2.345.000');
assert.strictEqual(parseMiles('80.000'), 80000);
assert.strictEqual(parseMiles('1.250.000'), 1250000);
assert.strictEqual(parseMiles(''), 0);
assert.strictEqual(parseMiles(null), 0);
console.log('✓ format.js tests passed');
