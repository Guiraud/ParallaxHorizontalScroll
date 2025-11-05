# Configuration Cloudflare Pages pour p.newsforge.app

## 📋 Vue d'ensemble

Ce projet est configuré pour être déployé sur **Cloudflare Pages** avec le domaine `p.newsforge.app`. Le système supporte le **routing dynamique** basé sur les fichiers JSON.

### Exemples d'URLs :
- `https://p.newsforge.app/grossophobie` → Charge `grossophobie.json`
- `https://p.newsforge.app/consentement` → Charge `consentement.json`
- `https://p.newsforge.app/` → Redirige vers `/grossophobie` (thème par défaut)

---

## 🚀 Configuration Cloudflare Pages

### 1. Créer un projet Cloudflare Pages

1. Connectez-vous à votre [tableau de bord Cloudflare](https://dash.cloudflare.com)
2. Allez dans **Pages** → **Create a project**
3. Connectez votre dépôt GitLab
4. Sélectionnez ce dépôt : `ParallaxHorizontalScroll`

### 2. Configuration du Build

**Framework preset:** Aucun (None)

**Build configuration:**
```
Build command: echo "Static site - no build needed"
Build output directory: /
Root directory: /
```

**Environment variables:** (aucune requise pour le moment)

### 3. Déployer sur un domaine personnalisé

1. Dans Cloudflare Pages, allez dans **Custom domains**
2. Ajoutez `p.newsforge.app`
3. Cloudflare configurera automatiquement le DNS

**Note:** Assurez-vous que le domaine `newsforge.app` est déjà géré par Cloudflare DNS.

---

## 🔧 Configuration GitLab CI/CD

### Variables à configurer dans GitLab

Allez dans **Settings** → **CI/CD** → **Variables** et ajoutez :

| Variable | Description | Où la trouver |
|----------|-------------|---------------|
| `CLOUDFLARE_API_TOKEN` | Token API Cloudflare | Cloudflare Dashboard → My Profile → API Tokens → Create Token |
| `CLOUDFLARE_ACCOUNT_ID` | ID du compte Cloudflare | Cloudflare Dashboard → Workers & Pages → Overview (dans l'URL) |

### Permissions du Token API

Créez un token avec les permissions :
- **Account** → **Cloudflare Pages** → **Edit**

---

## 📁 Structure des fichiers

```
ParallaxHorizontalScroll/
├── functions/
│   └── [[route]].js          # Cloudflare Pages Function pour routing dynamique
├── _redirects                 # Règles de redirection Cloudflare
├── cloudflare-pages.json      # Configuration Pages
├── wrangler.toml              # Configuration Wrangler
├── template.html              # Template HTML principal
├── grossophobie-script.js     # Script JS (support dynamique)
├── grossophobie-style.css     # Styles
├── grossophobie.json          # Données du thème "grossophobie"
├── consentement.json          # (à créer) Données du thème "consentement"
└── .gitlab-ci.yml             # Pipeline CI/CD
```

---

## 🎯 Comment ajouter un nouveau thème

### Exemple : Créer `consentement.json`

1. **Créez le fichier JSON** à la racine :
   ```bash
   touch consentement.json
   ```

2. **Structurez les données** selon le même format que `grossophobie.json` :
   ```json
   {
     "meta": {
       "title": "Parallax Consentement",
       "subtitle": "Comprendre et respecter le consentement"
     },
     "arguments": { ... },
     ...
   }
   ```

3. **Déployez** :
   ```bash
   git add consentement.json
   git commit -m "Add consentement theme"
   git push origin cloudflare-pages-deployment
   ```

4. **Accédez** : `https://p.newsforge.app/consentement`

---

## 🧪 Test en local

### Avec Wrangler (recommandé)

```bash
# Installer Wrangler
npm install -g wrangler

# Lancer le serveur de dev
wrangler pages dev .

# Accéder : http://localhost:8788/grossophobie
```

### Avec un serveur local classique

```bash
# Python
python3 -m http.server 8000

# Node.js
npx http-server

# Accéder : http://localhost:8000/grossophobie.html
```

**Note:** Le routing dynamique ne fonctionnera qu'avec Wrangler ou Cloudflare Pages.

---

## 🔄 Workflow de déploiement

### Déploiement automatique

1. **Branche `cloudflare-pages-deployment`** :
   - Push → Déclenche le pipeline GitLab CI/CD
   - Déploiement automatique sur `https://p.newsforge.app`

2. **Branche `main`** :
   - Également configurée pour déclencher le déploiement

3. **Autres branches** :
   - Créent des environnements de preview
   - URLs : `https://[nom-branche].parallax-newsforge.pages.dev`

### Déploiement manuel

```bash
# Depuis votre machine
wrangler pages deploy . --project-name=parallax-newsforge
```

---

## 🐛 Dépannage

### Le routing ne fonctionne pas

**Vérifiez :**
1. Le dossier `functions/` est bien présent
2. Le fichier `[[route]].js` existe
3. Le fichier `_redirects` est à la racine

### Erreur 404 sur un thème

**Vérifiez :**
1. Le fichier JSON existe (ex: `consentement.json`)
2. Le nom dans l'URL correspond au nom du fichier (sans `.json`)
3. Le fichier JSON est valide (pas d'erreurs de syntaxe)

### Le CSS/JS ne charge pas

**Vérifiez :**
1. Les chemins dans `template.html` sont corrects
2. Les fichiers CSS/JS sont bien à la racine
3. Le fichier `_redirects` autorise les extensions `.css` et `.js`

---

## 📚 Ressources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/platform/functions/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [GitLab CI/CD](https://docs.gitlab.com/ee/ci/)

---

## ✅ Checklist de déploiement

- [ ] Projet Cloudflare Pages créé
- [ ] Dépôt GitLab connecté
- [ ] Domaine `p.newsforge.app` configuré
- [ ] Variables GitLab CI/CD ajoutées (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`)
- [ ] Première branche `cloudflare-pages-deployment` créée
- [ ] Premier commit & push effectué
- [ ] Pipeline GitLab CI/CD exécuté avec succès
- [ ] Site accessible sur `https://p.newsforge.app/grossophobie`

---

**Contact :** Pour toute question, consultez la documentation Cloudflare ou ouvrez une issue sur le dépôt GitLab.
