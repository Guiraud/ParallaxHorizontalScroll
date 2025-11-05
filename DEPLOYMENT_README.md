# 🚀 Déploiement Cloudflare Pages - Guide Complet

## 📋 Résumé

Ce projet est maintenant configuré pour être déployé sur **Cloudflare Pages** avec le domaine `p.newsforge.app`.

### ✨ Fonctionnalités principales

- **Routing dynamique** : Chaque fichier JSON devient une page
  - `grossophobie.json` → `https://p.newsforge.app/grossophobie`
  - `consentement.json` → `https://p.newsforge.app/consentement`
  - Ajoutez un nouveau `.json` → nouvelle page automatique !

- **Template universel** : Un seul template HTML pour tous les thèmes
- **Chargement dynamique** : Le contenu est injecté automatiquement
- **GitLab CI/CD** : Déploiement automatique à chaque push

---

## 🌐 URLs du projet

| Environnement | URL | Description |
|---------------|-----|-------------|
| **Production** | `https://p.newsforge.app/grossophobie` | Thème grossophobie |
| **Production** | `https://p.newsforge.app/consentement` | Thème consentement |
| **Racine** | `https://p.newsforge.app/` | Redirige vers grossophobie |
| **Preview** | `https://[branch].parallax-newsforge.pages.dev` | Preview des branches |

---

## 📁 Architecture du projet

```
ParallaxHorizontalScroll/
├── functions/
│   └── [[route]].js          # 🔧 Cloudflare Function (routing dynamique)
│
├── Data (JSON themes)
│   ├── grossophobie.json      # 📊 Thème grossophobie
│   └── consentement.json      # 📊 Thème consentement
│
├── Templates
│   ├── template.html          # 🎨 Template HTML universel
│   ├── grossophobie-script.js # 💻 Script JS (chargement dynamique)
│   └── grossophobie-style.css # 🎨 Styles CSS
│
├── Configuration Cloudflare
│   ├── wrangler.toml          # ⚙️ Config Wrangler
│   ├── _redirects             # 🔀 Règles de redirection
│   └── cloudflare-pages.json  # ⚙️ Config Pages
│
├── CI/CD
│   └── .gitlab-ci.yml         # 🔄 Pipeline GitLab
│
└── Documentation
    ├── CLOUDFLARE_SETUP.md    # 📖 Guide de configuration
    └── DEPLOYMENT_README.md   # 📖 Ce fichier
```

---

## 🎯 Comment ça fonctionne ?

### 1. L'utilisateur visite une URL

```
https://p.newsforge.app/grossophobie
```

### 2. Cloudflare Pages Function intercepte la requête

Le fichier `functions/[[route]].js` :
- Extrait le nom du thème (`grossophobie`)
- Charge le fichier JSON correspondant (`grossophobie.json`)
- Injecte les données dans `template.html`
- Retourne le HTML complet

### 3. Le navigateur affiche la page

Le script `grossophobie-script.js` :
- Détecte `window.THEME_DATA` (déjà injecté)
- Affiche le contenu dynamiquement
- Applique les styles avec `grossophobie-style.css`

---

## 🆕 Ajouter un nouveau thème

### Étape 1 : Créer le fichier JSON

```bash
touch mon-nouveau-theme.json
```

### Étape 2 : Structurer les données

Utilisez le même format que `grossophobie.json` :

```json
{
  "meta": {
    "title": "Mon Nouveau Thème",
    "subtitle": "Description du thème",
    "author": "...",
    "petition": { ... }
  },
  "introduction": { ... },
  "arguments": { ... },
  ...
}
```

### Étape 3 : Commit et push

```bash
git add mon-nouveau-theme.json
git commit -m "Add mon-nouveau-theme"
git push origin cloudflare-pages-deployment
```

### Étape 4 : Accéder à la page

```
https://p.newsforge.app/mon-nouveau-theme
```

**C'est tout !** 🎉

---

## 🚀 Déploiement

### Déploiement automatique (recommandé)

1. **Push sur `cloudflare-pages-deployment` ou `main`** :
   ```bash
   git push origin cloudflare-pages-deployment
   ```

2. **GitLab CI/CD se déclenche automatiquement** :
   - Installe Wrangler
   - Déploie sur Cloudflare Pages
   - Site mis à jour en 1-2 minutes

### Déploiement manuel

```bash
# Installer Wrangler (une seule fois)
npm install -g wrangler

# Se connecter à Cloudflare
wrangler login

# Déployer
wrangler pages deploy . --project-name=parallax-newsforge
```

---

## 🔧 Configuration Cloudflare (première fois)

### 1. Variables GitLab CI/CD

Allez dans **GitLab** → **Settings** → **CI/CD** → **Variables**

Ajoutez :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | `votre-token` | Token API Cloudflare (Permissions: Cloudflare Pages Edit) |
| `CLOUDFLARE_ACCOUNT_ID` | `votre-account-id` | ID de compte Cloudflare |

### 2. Créer le projet Cloudflare Pages

1. Cloudflare Dashboard → **Pages** → **Create a project**
2. **Connect to Git** → Sélectionnez votre repo GitLab
3. **Build settings** :
   - Framework preset: **None**
   - Build command: `echo "Static site"`
   - Build output: `/`
4. **Deploy**

### 3. Ajouter le domaine personnalisé

1. Dans le projet Pages → **Custom domains**
2. Ajoutez `p.newsforge.app`
3. Cloudflare configure automatiquement le DNS

---

## 🧪 Test en local

### Avec Wrangler (routing dynamique fonctionne)

```bash
# Installer Wrangler
npm install -g wrangler

# Lancer le serveur
wrangler pages dev .

# Accéder
open http://localhost:8788/grossophobie
open http://localhost:8788/consentement
```

### Avec un serveur local classique (routing ne fonctionne pas)

```bash
# Python
python3 -m http.server 8000

# Node.js
npx http-server

# Accéder directement aux fichiers HTML
open http://localhost:8000/grossophobie.html
```

⚠️ Le routing dynamique (`/grossophobie` sans `.html`) ne fonctionne qu'avec Wrangler ou Cloudflare.

---

## 📊 Suivi des déploiements

### Dans GitLab

**GitLab** → **CI/CD** → **Pipelines**

Vous verrez :
- ✅ Pipeline réussi → Site déployé
- ❌ Pipeline échoué → Vérifier les logs

### Dans Cloudflare

**Cloudflare Dashboard** → **Pages** → **parallax-newsforge**

Vous verrez :
- Historique des déploiements
- Logs détaillés
- Métriques de trafic

---

## 🐛 Dépannage

### Le routing ne fonctionne pas

**Vérifiez :**
- Le dossier `functions/` existe et contient `[[route]].js`
- Le fichier `_redirects` est à la racine
- Vous testez avec Wrangler ou Cloudflare (pas un serveur local basique)

### Erreur 404 sur un thème

**Vérifiez :**
- Le fichier JSON existe (ex: `consentement.json`)
- Le nom dans l'URL correspond au nom du fichier (sans `.json`)
- Le JSON est valide (pas d'erreurs de syntaxe)

### CSS/JS ne charge pas

**Vérifiez :**
- Les chemins dans `template.html` pointent vers les bons fichiers
- Les fichiers CSS/JS sont à la racine
- Le fichier `_redirects` autorise les extensions `.css` et `.js`

### Pipeline GitLab échoue

**Vérifiez :**
- Les variables `CLOUDFLARE_API_TOKEN` et `CLOUDFLARE_ACCOUNT_ID` sont définies
- Le token a les bonnes permissions (Cloudflare Pages Edit)
- Le nom du projet dans `.gitlab-ci.yml` correspond au nom sur Cloudflare

---

## 📚 Fichiers importants

| Fichier | Rôle | Quand le modifier |
|---------|------|-------------------|
| `functions/[[route]].js` | Routing dynamique | Changer la logique de routing |
| `template.html` | Structure HTML | Modifier la mise en page |
| `grossophobie-script.js` | Logique JS | Ajouter des fonctionnalités |
| `grossophobie-style.css` | Styles | Changer l'apparence |
| `wrangler.toml` | Config Wrangler | Changer le nom du projet |
| `_redirects` | Redirections | Ajouter des règles de redirection |
| `.gitlab-ci.yml` | Pipeline CI/CD | Modifier le workflow de déploiement |

---

## ✅ Checklist de déploiement initial

- [ ] Variables GitLab CI/CD configurées (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`)
- [ ] Projet Cloudflare Pages créé
- [ ] Dépôt GitLab connecté à Cloudflare
- [ ] Domaine `p.newsforge.app` configuré
- [ ] Branche `cloudflare-pages-deployment` créée
- [ ] Premier commit pushé
- [ ] Pipeline GitLab exécuté avec succès
- [ ] Site accessible sur `https://p.newsforge.app/grossophobie`
- [ ] Test d'un second thème (`/consentement`)

---

## 🎓 Ressources

- **Documentation Cloudflare Pages** : https://developers.cloudflare.com/pages/
- **Cloudflare Pages Functions** : https://developers.cloudflare.com/pages/platform/functions/
- **Wrangler CLI** : https://developers.cloudflare.com/workers/wrangler/
- **GitLab CI/CD** : https://docs.gitlab.com/ee/ci/

---

## 💡 Astuces

### Changer le thème par défaut

Éditez `functions/[[route]].js` ligne 9 :

```javascript
const themeName = pathParts[0] || 'mon-theme-par-defaut';
```

### Ajouter des variables d'environnement

Éditez `wrangler.toml` :

```toml
[vars]
DEFAULT_THEME = "grossophobie"
MA_VARIABLE = "valeur"
```

Accédez dans `[[route]].js` via :

```javascript
const maVar = context.env.MA_VARIABLE;
```

### Créer un environnement de staging

Modifiez `.gitlab-ci.yml` pour ajouter un job `deploy_staging` qui déploie sur une branche spécifique.

---

**Bon déploiement ! 🚀**

Pour toute question, consultez `CLOUDFLARE_SETUP.md` ou la documentation Cloudflare.
