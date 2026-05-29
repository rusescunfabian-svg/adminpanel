# Admin Live Impianti su Netlify (Decap CMS)

## Cosa fa il cliente

1. Va su **https://www.liveimpianti.it/admin/**
2. Fa login (Netlify Identity – invito via email)
3. Aggiunge/modifica progetti: **foto, testi, categoria**
4. Clic **Salva** → commit su GitHub → **Netlify pubblica il sito da solo** (1–2 min)

Non serve scaricare file manualmente (a differenza di `admin-progetti.html`).

---

## Configurazione una tantum (da fare tu)

### 1. Repository Git

- Carica il sito su **GitHub** (repo privato va bene)
- In **Netlify** → Site settings → Build & deploy → collega il repo
- Branch: `main`
- Build command: `node scripts/sync-progetti-data.js`
- Publish directory: `.` (root del repo, dove c’è `index.html`)

### 2. Netlify Identity

Netlify dashboard → **Identity** → Enable Identity  
→ **Registration**: Invite only (solo inviti, non registrazione aperta)  
→ Invita gli email del cliente (Settings → Users → Invite)

### 3. Git Gateway

Netlify → **Identity** → **Services** → **Git Gateway** → Enable

### 4. URL admin

Il file `admin/index.html` + `admin/config.yml` espongono il pannello su:

`https://www.tuosito.it/admin/`

### 5. (Opzionale) Dominio custom

Assicurati che `liveimpianti.it` punti al sito Netlify.

---

## Sviluppo locale

```bash
npx decap-server
```

Poi apri `admin/index.html` via server locale (es. `npx serve .`).

In `admin/config.yml` è attivo `local_backend: true`.

---

## Note

- Le **immagini** caricate dal CMS finiscono in `images/` nel repo.
- Il file **`progetti.json`** è la fonte dati del sito.
- **`progetti-data.js`** si rigenera a ogni deploy (script in `scripts/`).
- Il vecchio `admin-progetti.html` resta come backup offline, non serve in produzione.
