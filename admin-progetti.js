/* Pannello gestione progetti – Live Impianti
   Cambiate ADMIN_PASSWORD prima di consegnare al cliente. */

const ADMIN_PASSWORD = 'liveimpianti2025';

const $ = (sel) => document.querySelector(sel);
const loginScreen = $('#loginScreen');
const app = $('#app');
const projectList = $('#projectList');
const form = $('#projectForm');

let catalog = null;

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

function linesToArray(str) {
  return str
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function arrayToLines(arr) {
  return (arr || []).join('\n');
}

function showMessage(text, ok = true) {
  const el = $('#formMessage');
  el.textContent = text;
  el.className = 'form-message ' + (ok ? 'ok' : 'err');
  el.hidden = false;
  setTimeout(() => { el.hidden = true; }, 4000);
}

function initCatalog() {
  if (window.PROGETTI_DATA) {
    catalog = JSON.parse(JSON.stringify(window.PROGETTI_DATA));
    return;
  }
  throw new Error('Dati non caricati. Verificate che progetti-data.js esista.');
}

function getFilteredProjects() {
  const q = $('#searchInput').value.trim().toLowerCase();
  const cat = $('#filterCat').value;
  return catalog.progetti.filter((p) => {
    if (cat && p.categoria !== cat) return false;
    if (!q) return true;
    const hay = `${p.titolo} ${p.titoloCompleto} ${p.location} ${p.id}`.toLowerCase();
    return hay.includes(q);
  });
}

function renderList(activeId) {
  const items = getFilteredProjects().sort(
    (a, b) => (a.ordine ?? 999) - (b.ordine ?? 999)
  );
  projectList.innerHTML = items
    .map(
      (p) => `
    <li>
      <button type="button" data-id="${p.id}" class="${p.id === activeId ? 'active' : ''}">
        ${p.titolo}
        <span class="cat">${p.categoria}</span>
      </button>
    </li>`
    )
    .join('');

  projectList.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => loadProject(btn.dataset.id));
  });
}

function findIndexById(id) {
  return catalog.progetti.findIndex((p) => p.id === id);
}

function loadProject(id) {
  const idx = findIndexById(id);
  if (idx < 0) return;
  const p = catalog.progetti[idx];

  $('#editIndex').value = String(idx);
  $('#id').value = p.id;
  $('#id').readOnly = true;
  $('#categoria').value = p.categoria;
  $('#ordine').value = p.ordine ?? 1;
  $('#label').value = p.label || '';
  $('#labelStile').value = p.labelStile || '';
  $('#immagine').value = p.immagine || '';
  $('#titolo').value = p.titolo || '';
  $('#titoloCompleto').value = p.titoloCompleto || '';
  $('#titoloHome').value = p.titoloHome || '';
  $('#location').value = p.location || '';
  $('#descrizione').value = p.descrizione || '';
  $('#descrizioneCompleta').value = p.descrizioneCompleta || '';
  $('#features').value = arrayToLines(p.features);
  $('#tags').value = arrayToLines(p.tags);
  $('#showOnHome').checked = !!p.showOnHome;
  $('#featured').checked = !!p.featured;

  $('#deleteBtn').hidden = false;
  updatePreview();
  renderList(p.id);
}

function resetForm() {
  form.reset();
  $('#editIndex').value = '';
  $('#id').readOnly = false;
  $('#ordine').value = 1;
  $('#deleteBtn').hidden = true;
  $('#previewBox').hidden = true;
  renderList(null);
}

function buildProjectFromForm() {
  const id = $('#id').value.trim();
  const labelStile = $('#labelStile').value;
  const p = {
    id,
    categoria: $('#categoria').value,
    ordine: Number($('#ordine').value) || 1,
    label: $('#label').value.trim(),
    immagine: $('#immagine').value.trim(),
    titolo: $('#titolo').value.trim(),
    titoloCompleto: $('#titoloCompleto').value.trim(),
    location: $('#location').value.trim(),
    descrizione: $('#descrizione').value.trim(),
    descrizioneCompleta: $('#descrizioneCompleta').value.trim(),
    features: linesToArray($('#features').value),
    tags: linesToArray($('#tags').value),
    featured: $('#featured').checked,
    showOnHome: $('#showOnHome').checked,
  };
  if (labelStile) p.labelStile = labelStile;
  const titoloHome = $('#titoloHome').value.trim();
  if (titoloHome) p.titoloHome = titoloHome;
  return p;
}

function suggestOrdine(categoria) {
  const inCat = catalog.progetti.filter((p) => p.categoria === categoria);
  if (!inCat.length) return 1;
  return Math.max(...inCat.map((p) => p.ordine ?? 0)) + 1;
}

function updatePreview() {
  const src = $('#immagine').value.trim();
  const box = $('#previewBox');
  const img = $('#previewImg');
  if (!src) {
    box.hidden = true;
    return;
  }
  img.src = src;
  img.onerror = () => { box.hidden = true; };
  img.onload = () => { box.hidden = false; };
}

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function exportFiles() {
  const json = JSON.stringify(catalog, null, 2);
  downloadFile('progetti.json', json, 'application/json');
  setTimeout(() => {
    downloadFile(
      'progetti-data.js',
      'window.PROGETTI_DATA = ' + json + ';\n',
      'text/javascript'
    );
  }, 400);
  showMessage('File scaricati. Caricateli sul hosting per pubblicare.', true);
}

/* Login */
function tryLogin() {
  if ($('#loginPassword').value === ADMIN_PASSWORD) {
    sessionStorage.setItem('live_admin_ok', '1');
    loginScreen.hidden = true;
    app.hidden = false;
    initCatalog();
    renderList(null);
    return;
  }
  $('#loginError').hidden = false;
}

$('#loginBtn').addEventListener('click', tryLogin);
$('#loginPassword').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') tryLogin();
});

if (sessionStorage.getItem('live_admin_ok') === '1') {
  loginScreen.hidden = true;
  app.hidden = false;
  try {
    initCatalog();
    renderList(null);
  } catch (e) {
    alert(e.message);
  }
}

/* Form */
$('#newBtn').addEventListener('click', () => {
  resetForm();
  const cat = $('#filterCat').value || 'ville';
  $('#categoria').value = cat;
  $('#ordine').value = suggestOrdine(cat);
});

$('#categoria').addEventListener('change', () => {
  if (!$('#editIndex').value) {
    $('#ordine').value = suggestOrdine($('#categoria').value);
  }
});

$('#titolo').addEventListener('blur', () => {
  if (!$('#id').readOnly && !$('#id').value.trim()) {
    $('#id').value = slugify($('#titolo').value) || 'progetto-nuovo';
  }
});

$('#immagine').addEventListener('input', updatePreview);
$('#searchInput').addEventListener('input', () => renderList($('#id').value));
$('#filterCat').addEventListener('change', () => renderList($('#id').value));
$('#resetBtn').addEventListener('click', resetForm);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const p = buildProjectFromForm();
  if (!/^[a-z0-9\-]+$/.test(p.id)) {
    showMessage('ID non valido: usa solo lettere minuscole, numeri e trattini.', false);
    return;
  }

  const idx = $('#editIndex').value;
  if (idx !== '') {
    const existing = findIndexById(p.id);
    if (existing >= 0 && existing !== Number(idx)) {
      showMessage('Esiste già un progetto con questo ID.', false);
      return;
    }
    catalog.progetti[Number(idx)] = p;
    showMessage('Progetto aggiornato. Scaricate i file per pubblicare online.');
  } else {
    if (findIndexById(p.id) >= 0) {
      showMessage('ID già in uso. Sceglietene un altro.', false);
      return;
    }
    catalog.progetti.push(p);
    $('#editIndex').value = String(catalog.progetti.length - 1);
    $('#id').readOnly = true;
    $('#deleteBtn').hidden = false;
    showMessage('Progetto aggiunto. Scaricate i file per pubblicare online.');
  }
  renderList(p.id);
});

$('#deleteBtn').addEventListener('click', () => {
  const idx = Number($('#editIndex').value);
  if (idx < 0 || !confirm('Eliminare questo progetto dal catalogo?')) return;
  catalog.progetti.splice(idx, 1);
  resetForm();
  showMessage('Progetto eliminato. Scaricate i file per aggiornare il sito.');
});

$('#exportBtn').addEventListener('click', exportFiles);

$('#importFile').addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if (!data.progetti || !Array.isArray(data.progetti)) {
      throw new Error('File non valido');
    }
    if (!data.categorie) data.categorie = catalog?.categorie || [];
    catalog = data;
    resetForm();
    renderList(null);
    showMessage('Catalogo importato. Controllate i dati e scaricate i file.');
  } catch (err) {
    showMessage('Importazione fallita: file JSON non valido.', false);
  }
  e.target.value = '';
});
