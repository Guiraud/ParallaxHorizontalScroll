# 📋 Prochaines Étapes - Déploiement Cloudflare Pages

## ✅ Ce qui a été fait

1. **✅ Branche créée** : `cloudflare-pages-deployment`
2. **✅ Routing dynamique** : Fonction Cloudflare Pages (`functions/[[route]].js`)
3. **✅ Template universel** : `template.html` avec injection dynamique
4. **✅ Script adapté** : `grossophobie-script.js` supporte Cloudflare et mode local
5. **✅ Configuration complète** :
   - `wrangler.toml`
   - `_redirects`
   - `cloudflare-pages.json`
   - `.gitlab-ci.yml`
6. **✅ Documentation** :
   - `CLOUDFLARE_SETUP.md` (configuration détaillée)
   - `DEPLOYMENT_README.md` (guide d'utilisation)
7. **✅ Exemple de thème** : `consentement.json`

---

## 🚀 Prochaines étapes pour finaliser le déploiement

### Étape 1 : Pusher la branche sur GitLab

```bash
# Vérifier que vous êtes sur la bonne branche
git branch

# Pusher vers GitLab
git push origin cloudflare-pages-deployment
```

**Résultat attendu** : La branche apparaît sur GitLab

---

### Étape 2 : Configurer Cloudflare Pages

#### 2.1 Créer un compte/projet Cloudflare Pages

1. Allez sur https://dash.cloudflare.com
2. **Pages** → **Create a project**
3. **Connect to Git** → Sélectionnez **GitLab**
4. Autorisez l'accès à votre compte GitLab
5. Sélectionnez le dépôt : `ParallaxHorizontalScroll`
6. Branche à déployer : `cloudflare-pages-deployment`

#### 2.2 Configuration du build

| Paramètre | Valeur |
|-----------|--------|
| **Framework preset** | None |
| **Build command** | `echo "Static site - no build needed"` |
| **Build output directory** | `/` |
| **Root directory** | `/` |

#### 2.3 Variables d'environnement (optionnel)

Pour l'instant, aucune variable n'est nécessaire.

Cliquez sur **Save and Deploy**

---

### Étape 3 : Configurer le domaine personnalisé `p.newsforge.app`

#### 3.1 Vérifier que le domaine est sur Cloudflare DNS

1. **Cloudflare Dashboard** → **Websites**
2. Vérifiez que `newsforge.app` est présent
3. Si non, ajoutez-le : **Add a Site** → Suivez les instructions

#### 3.2 Ajouter le sous-domaine au projet Pages

1. Dans votre projet Pages → **Custom domains**
2. Cliquez sur **Set up a custom domain**
3. Entrez : `p.newsforge.app`
4. Cloudflare créera automatiquement un enregistrement CNAME

**Résultat attendu** : `p.newsforge.app` pointe vers votre projet Pages

---

### Étape 4 : Configurer GitLab CI/CD (optionnel, pour déploiement auto)

#### 4.1 Créer un Token API Cloudflare

1. **Cloudflare Dashboard** → **My Profile** → **API Tokens**
2. **Create Token**
3. Utilisez le template **Edit Cloudflare Pages**
4. **Permissions** :
   - Account → Cloudflare Pages → Edit
5. Copiez le token (vous ne le reverrez plus !)

#### 4.2 Trouver votre Account ID

1. **Cloudflare Dashboard** → **Pages** → Votre projet
2. L'URL contient : `https://dash.cloudflare.com/[ACCOUNT_ID]/pages/...`
3. Copiez `[ACCOUNT_ID]`

#### 4.3 Ajouter les variables dans GitLab

1. **GitLab** → Votre projet → **Settings** → **CI/CD**
2. **Variables** → **Expand** → **Add variable**

**Variable 1** :
- Key : `CLOUDFLARE_API_TOKEN`
- Value : Le token créé à l'étape 4.1
- Type : Variable
- ✅ Masked (coché)
- ⬜ Protected (décoché pour pouvoir utiliser sur toutes les branches)

**Variable 2** :
- Key : `CLOUDFLARE_ACCOUNT_ID`
- Value : L'Account ID de l'étape 4.2
- Type : Variable
- ⬜ Masked
- ⬜ Protected

**Résultat attendu** : GitLab peut maintenant déployer automatiquement sur Cloudflare

---

### Étape 5 : Tester le déploiement

#### 5.1 Accéder au site

Attendez 1-2 minutes que le déploiement se termine, puis :

```
https://p.newsforge.app/grossophobie
https://p.newsforge.app/consentement
https://p.newsforge.app/  (redirige vers grossophobie)
```

#### 5.2 Vérifier que tout fonctionne

- [ ] La page s'affiche correctement
- [ ] Les styles CSS sont appliqués
- [ ] Le JavaScript fonctionne (interactions, modales, etc.)
- [ ] Les données JSON sont chargées
- [ ] Le routing fonctionne (`/grossophobie`, `/consentement`)

#### 5.3 Vérifier les logs (si problème)

**Dans Cloudflare** :
- Projet Pages → **View build**
- Consultez les logs de déploiement

**Dans GitLab** :
- **CI/CD** → **Pipelines**
- Cliquez sur le pipeline → Consultez les logs

---

## 🧪 Test en local (optionnel)

Avant de pousser sur GitLab, vous pouvez tester en local :

```bash
# Installer Wrangler (une seule fois)
npm install -g wrangler

# Se connecter à Cloudflare (une seule fois)
wrangler login

# Lancer le serveur de dev
wrangler pages dev .

# Accéder
open http://localhost:8788/grossophobie
open http://localhost:8788/consentement
```

**Note** : Le routing dynamique fonctionne uniquement avec Wrangler ou Cloudflare.

---

## 📊 Workflow après la configuration initiale

Une fois les étapes 1-5 complétées, le workflow sera :

### Pour ajouter un nouveau thème

1. Créez `mon-theme.json` à la racine
2. Structurez les données (même format que `grossophobie.json`)
3. Commit et push :
   ```bash
   git add mon-theme.json
   git commit -m "Add mon-theme"
   git push origin cloudflare-pages-deployment
   ```
4. GitLab CI/CD déploie automatiquement
5. Accédez à `https://p.newsforge.app/mon-theme`

### Pour modifier un thème existant

1. Éditez le fichier JSON
2. Commit et push :
   ```bash
   git add grossophobie.json
   git commit -m "Update grossophobie content"
   git push origin cloudflare-pages-deployment
   ```
3. Déploiement automatique en 1-2 minutes

---

## 🔄 Merge vers main (optionnel)

Une fois que tout fonctionne sur `cloudflare-pages-deployment` :

```bash
# Retourner sur main
git checkout main

# Merger la branche
git merge cloudflare-pages-deployment

# Pousser sur main
git push origin main
```

**Note** : Le pipeline est configuré pour déployer aussi depuis `main`.

---

## 📝 Checklist complète

- [ ] **Étape 1** : Branche pushée sur GitLab
- [ ] **Étape 2** : Projet Cloudflare Pages créé et configuré
- [ ] **Étape 3** : Domaine `p.newsforge.app` configuré
- [ ] **Étape 4** : Variables GitLab CI/CD ajoutées (optionnel)
- [ ] **Étape 5** : Site accessible et fonctionnel

### Tests

- [ ] `/grossophobie` fonctionne
- [ ] `/consentement` fonctionne
- [ ] `/` redirige vers `/grossophobie`
- [ ] CSS chargé correctement
- [ ] JavaScript fonctionne
- [ ] Données JSON affichées

---

## 🐛 Aide au dépannage

### Le site ne s'affiche pas

**Vérifiez** :
1. Cloudflare Dashboard → Deployment status (réussi ?)
2. Les logs de déploiement (erreurs ?)
3. Le domaine `p.newsforge.app` est bien configuré

### Erreur 404 sur les thèmes

**Vérifiez** :
1. Le fichier JSON existe (ex: `grossophobie.json`)
2. Le nom dans l'URL correspond (sans `.json`)
3. Le dossier `functions/` contient bien `[[route]].js`

### CSS/JS ne charge pas

**Vérifiez** :
1. Les fichiers sont à la racine
2. Le fichier `_redirects` autorise `.css` et `.js`
3. Les chemins dans `template.html` sont corrects

### GitLab CI/CD échoue

**Vérifiez** :
1. Les variables `CLOUDFLARE_API_TOKEN` et `CLOUDFLARE_ACCOUNT_ID` sont définies
2. Le token a les bonnes permissions
3. Le nom du projet correspond (`parallax-newsforge`)

---

## 📚 Documentation

- **Configuration** : `CLOUDFLARE_SETUP.md`
- **Guide d'utilisation** : `DEPLOYMENT_README.md`
- **Ce fichier** : `NEXT_STEPS.md`

---

## 💡 Commandes utiles

```bash
# Voir la branche actuelle
git branch

# Passer sur cloudflare-pages-deployment
git checkout cloudflare-pages-deployment

# Voir l'historique
git log --oneline -n 10

# Pousser vers GitLab
git push origin cloudflare-pages-deployment

# Tester en local avec Wrangler
wrangler pages dev .

# Déployer manuellement
wrangler pages deploy . --project-name=parallax-newsforge
```

---

**Bon déploiement ! 🚀**

En cas de problème, consultez :
- `CLOUDFLARE_SETUP.md` (configuration détaillée)
- `DEPLOYMENT_README.md` (guide complet)
- Documentation Cloudflare : https://developers.cloudflare.com/pages/
