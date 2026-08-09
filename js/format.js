export function formatMiles(n) {
  if (!n && n !== 0) return '';
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function parseMiles(str) {
  if (!str) return 0;
  return parseInt(str.toString().replace(/\./g, ''), 10) || 0;
}

export function formatMoneda(n) {
  return '$ ' + formatMiles(n);
}
