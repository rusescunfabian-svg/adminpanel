# Admin Live Impianti su Netlify (Decap CMS)

## Cosa fa il cliente

1. Va su **https://TUO-SITO.netlify.app/admin/** (o `liveimpianti.it/admin/` quando il dominio è attivo)
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

#### Solo URL Netlify (preview, senza dominio custom)

Va benissimo. L’invito deve puntare al sito **.netlify.app**, non a `liveimpianti.it` se il dominio non è ancora collegato.

1. In Netlify → **Site configuration** → **Domain management**, copia l’URL principale, es.  
   `https://nome-sito-12345.netlify.app`

2. **Identity** → **Settings and usage** → **Identity settings**  
   - Verifica che il sito sia quello giusto (stesso progetto Netlify del deploy)

3. **Identity** → **URL settings** (o Registration preferences)  
   Aggiungi in **Redirect URLs** (se presente):
   - `https://TUO-SITO.netlify.app/`
   - `https://TUO-SITO.netlify.app/admin/`

4. Dopo ogni modifica al codice (script Identity in `index.html`), fai **Deploy** e solo poi reinvia l’invito.

5. Il link nell’email di invito deve essere simile a:  
   `https://TUO-SITO.netlify.app/#invite_token=...`  
   Se apre la home senza popup → controlla che l’ultimo deploy includa `netlify-identity-widget.js`.

6. Quando collegherete **liveimpianti.it**, in Netlify aggiungete il dominio custom e reinviate gli inviti (o usate il nuovo dominio).

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
