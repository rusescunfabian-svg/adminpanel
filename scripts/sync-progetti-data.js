/**
 * Genera progetti-data.js da progetti.json (per anteprima locale).
 * Eseguito automaticamente da Netlify ad ogni deploy.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const jsonPath = path.join(root, 'progetti.json');
const outPath = path.join(root, 'progetti-data.js');

const json = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(json);

function normalizeList(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((item) => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object') {
      return item.voce || item.tag || item.item || item.feature || '';
    }
    return '';
  }).filter(Boolean);
}

if (data.progetti) {
  data.progetti.forEach((p) => {
    p.features = normalizeList(p.features);
    p.tags = normalizeList(p.tags);
  });
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

const outJson = JSON.stringify(data, null, 2);
fs.writeFileSync(outPath, `window.PROGETTI_DATA = ${outJson};\n`, 'utf8');
console.log('sync-progetti-data: OK');
