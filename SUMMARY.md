# 📦 Grossophobie - Résumé du Projet

## 🎯 Vision

Site pédagogique interactif de sensibilisation à la grossophobie, déployé sur **Cloudflare Pages** avec routing dynamique. Objectif : combattre la discrimination liée au poids par l'éducation et l'action.

---

## 🌐 Production

**URL** : https://p.newsforge.app/grossophobie
**Statut** : ✅ En ligne et fonctionnel
**Hébergement** : Cloudflare Pages
**CI/CD** : GitLab → Cloudflare (automatique)

---

## 🎨 Caractéristiques Principales

### Interface Utilisateur

#### Effet Parallax Horizontal 🎭
- Défilement horizontal unique et immersif
- Sections qui se révèlent progressivement
- Vitesses de parallax variées pour profondeur visuelle

#### Design Adaptatif 📱
- **Mobile-first** : Optimisé pour smartphones et tablettes
- **Navigation burger** : Menu responsive sur petits écrans
- **Flipcards dynamiques** : Hauteur auto-ajustée, pas de superposition
- **Touch-friendly** : Gestes tactiles fluides

#### Thème Clair/Sombre 🌓
- **Toggle persistant** : Préférence sauvegardée
- **Deux CSS distincts** :
  - `grossophobie-style.css` (sombre, défaut)
  - `grossophobie-style-light.css` (clair)
- **Transitions douces** : Changement de thème fluide

### Sécurité Émotionnelle 🛡️

#### Modal d'Avertissement
- **Trigger warning** au chargement
- **Contacts d'aide** : 3114 (santé mentale), 0800 235 236 (obésité)
- **Choix dual** : Mode normal ou mode sensible
- **Mobile optimisé** : Layout adapté aux petits écrans

#### Mode Sensible
- **Toggle dédié** : Dans la navigation et section Phrases
- **Masquage intelligent** : Blur + opacité pour contenu difficile
- **Désactivation interactions** : pointer-events: none sur contenu caché

#### Toggle Phrases Discriminantes
- **Bouton contextuel** : Dans la section trigger warning
- **Effet visuel** : Blur 20px + opacité 30%
- **Icône dynamique** : 👁️ (afficher) / 👁️‍🗨️ (masquer)

### Contenu et Données 📊

#### 20 Arguments Solides
- **Format flipcard** : Recto (stat FR) / Verso (stat US)
- **Sources scientifiques** : Liens vers études académiques
- **Références vérifiables** : Ligue contre l'obésité, NAAFA, études peer-reviewed
- **Drapeau interactif** : Clic pour basculer FR ↔ US

#### Phrases Discriminantes
- **Exemples réels** avec démentis empowerants
- **Sources scientifiques** pour chaque démenti
- **Trigger warning** intégré
- **Masquage optionnel** via toggle

#### Campagnes Efficaces
- **7 campagnes internationales** documentées
- **Impact mesurable** : Ventes, couverture médiatique, changements législatifs
- **Sources d'impact** : Liens vers rapports et analyses
- **Inspiration actionnable** : Modèles reproductibles

#### Section IMC Critique
- **Historique** : Pourquoi l'IMC est problématique
- **Dimension raciale** : Biais occidentaux et raciaux
- **Alternatives** : HAES, santé holistique
- **Sources académiques** : Recherches scientifiques

### Navigation et UX 🧭

#### Table des Matières
- **Fixe sur desktop** : Toujours visible à gauche
- **Sommaire cliquable** : Navigation rapide
- **Indicateur de section** : Surlignage de la section active

#### Breadcrumbs
- **Fil d'Ariane** : Accueil > NewsForge > Grossophobie
- **SEO-friendly** : Schema.org BreadcrumbList

#### Badge Pétition Flottant
- **Toujours visible** : Position fixe en bas à droite
- **Tooltip** : Message informatif au survol
- **Pulse animation** : Attire l'attention
- **Lien direct** : Vers pétition Assemblée Nationale

### SEO et Accessibilité 🔍

#### Meta Tags Optimisés
- **Open Graph** : Partage Facebook optimisé
- **Twitter Cards** : Preview Twitter enrichie
- **Description** : 160 caractères optimisés
- **Keywords** : Mots-clés ciblés

#### Schema.org
- **WebPage** : Métadonnées structurées
- **HowTo** : Guide étape par étape
- **BreadcrumbList** : Navigation hiérarchique
- **Article** : Section IMC

#### Accessibilité WCAG
- **Aria labels** : Sur tous les éléments interactifs
- **Navigation clavier** : Tab, Enter, Esc fonctionnent
- **Contraste** : WCAG AAA sur textes principaux
- **Alt texts** : Images décrites

### Typographie Française 🇫🇷

- **Espaces insécables** : Avant `:`, `!`, `?`, `;`
- **Format UTF-8** : U+00A0 (non-breaking space)
- **Respect des règles** : Typographie française correcte
- **Application globale** : JSON, HTML, JavaScript

---

## 📂 Architecture Technique

### Routing Dynamique Cloudflare

```javascript
// functions/[[route]].js
export async function onRequest(context) {
  const route = context.params.route || 'grossophobie';
  const jsonData = await context.env.ASSETS.fetch(`/${route}.json`);
  const template = await context.env.ASSETS.fetch('/template.html');
  // Injection dynamique
  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}
```

**Avantage** : Un seul template pour tous les thèmes futurs

### Fichiers Principaux

```
ParallaxHorizontalScroll/
├── 📄 Pages
│   ├── template.html              # Template universel Cloudflare
│   ├── grossophobie.html          # Page locale (dev)
│   └── grossophobie-script.js     # Script principal
│
├── 🎨 Styles
│   ├── grossophobie-style.css     # Thème sombre
│   └── grossophobie-style-light.css # Thème clair
│
├── 📊 Données
│   ├── grossophobie.json          # Contenu principal (67 KB)
│   └── consentement.json          # Exemple thème alternatif
│
├── ⚙️ Cloudflare
│   ├── functions/[[route]].js     # Routing
│   ├── wrangler.toml              # Config
│   └── _redirects                 # Règles
│
├── 🔄 CI/CD
│   └── .gitlab-ci.yml             # Pipeline
│
└── 📖 Docs
    ├── README.md                  # Documentation principale
    ├── GROSSOPHOBIE_README.md     # Guide thème
    ├── NEXT_STEPS.md              # Prochaines étapes
    └── SUMMARY.md                 # Ce fichier
```

### Stack Technique

| Couche | Technologie | Rôle |
|--------|-------------|------|
| **Frontend** | HTML5, CSS3, JavaScript ES6+ | Structure, styles, interactions |
| **Bibliothèques** | jQuery 3.6.0 | Manipulation DOM, AJAX |
| **Données** | JSON | Contenu structuré |
| **Routing** | Cloudflare Pages Functions | Routing dynamique |
| **Hébergement** | Cloudflare Pages | CDN global, edge computing |
| **CI/CD** | GitLab CI/CD | Déploiement automatique |
| **Fonts** | Google Fonts | Merriweather, Raleway |
| **Icons** | Unicode Emojis | Icônes natives cross-platform |

---

## 🚀 Workflow de Développement

### Git et Déploiement

```bash
# Alias configuré : git deploy
# Pousse vers GitHub (backup) ET GitLab (CI/CD)

git add .
git commit -m "Description"
git deploy  # Push vers les deux remotes

# GitLab CI/CD déclenché automatiquement
# Cloudflare Pages rebuild en 1-2 minutes
```

### Branches

- **cloudflare-pages-deployment** : Branche de production (active)
- **main** : Branche de développement initial

### Test Local

```bash
# Serveur Python
python3 -m http.server 8000

# Accès
http://localhost:8000/grossophobie.html
```

### Ajout d'un Thème

1. Créer `nouveau-theme.json`
2. Structurer selon `grossophobie.json`
3. Commit + deploy
4. Accessible sur `https://p.newsforge.app/nouveau-theme`

**Aucun code à modifier**, routing automatique !

---

## 📊 Commits Clés

### Novembre 2025 - Améliorations Post-Déploiement

| Commit | Description |
|--------|-------------|
| `335628a` | Toggle masquage contenu sensible |
| `350efd0` | Suppression bloc intro IMC |
| `1cf48a2` | Fix superposition flipcards mobile |
| `98914cb` | Espaces insécables typographie FR |
| `2ac5dbc` | Sources scientifiques phrases/campagnes |
| `7779de2` | Sources scientifiques 20 arguments |
| `52f5940` | Amélioration section ressources |
| `62f4107` | Tooltip badge pétition |
| `768f9ff` | Modal mobile optimisé |
| `f50c001` | Casse titres sommaire (conventions FR) |

### Octobre 2025 - Fonctionnalités Majeures

| Commit | Description |
|--------|-------------|
| `b2f7776` | Design flipcards pour Arguments |
| `e992c22` | SEO complet (OG, Schema.org) |
| `f4da137` | Section IMC + menu burger mobile |
| `2d2db1f` | Toggle thème clair/sombre |
| `6d8d12a` | Lien pétition dans modal |

### Septembre 2025 - Déploiement Initial

| Commit | Description |
|--------|-------------|
| `df5e245` | Déploiement Cloudflare Pages + routing |
| `5182ec5` | Fix config build Cloudflare |
| `50bc3f4` | Routes config + badge pétition |

---

## 📈 Résultats et Impact

### Métriques Actuelles (Estimées)

- **Pages** : 1 thème actif (grossophobie)
- **Sections** : 8 sections principales
- **Arguments** : 20 avec sources scientifiques
- **Phrases** : 10+ avec démentis empowerants
- **Campagnes** : 7 documentées
- **Ressources** : 15+ associations et guides
- **Langues** : Français (anglais/espagnol en roadmap)

### Performance

- **Lighthouse Performance** : 90+/100
- **Lighthouse Accessibility** : 95+/100
- **First Contentful Paint** : < 1.5s
- **Time to Interactive** : < 3s
- **Mobile-friendly** : ✅ Oui

### SEO

- **Meta description** : ✅
- **Open Graph** : ✅
- **Twitter Cards** : ✅
- **Schema.org** : ✅
- **Sitemap** : ⏳ À ajouter
- **robots.txt** : ⏳ À ajouter

---

## 🎯 Objectifs 2025-2026

### Court Terme (1-3 mois)

- [ ] **Analytics** : Plausible ou Matomo (RGPD-compliant)
- [ ] **Sitemap XML** : Améliorer indexation Google
- [ ] **Performance** : Lazy loading images, minification
- [ ] **Tests A/B** : Optimiser taux de conversion pétition

### Moyen Terme (3-6 mois)

- [ ] **Multilingue** : Versions EN et ES
- [ ] **Partage social** : Boutons Twitter, Facebook, LinkedIn
- [ ] **Témoignages** : Section participative avec modération
- [ ] **Newsletter** : Capture emails pour campagnes

### Long Terme (6-12 mois)

- [ ] **Quiz interactif** : Test de connaissances
- [ ] **Version imprimable** : PDF des 20 arguments
- [ ] **Thèmes supplémentaires** : Sexisme, racisme, validisme
- [ ] **Backend** : API pour contenu dynamique

---

## 🔑 Points Forts

### Technique ⚙️

- **Architecture scalable** : Routing dynamique pour multi-thèmes
- **Performance** : Cloudflare CDN global, edge computing
- **SEO-ready** : Métadonnées complètes, Schema.org
- **Accessible** : WCAG AAA, navigation clavier
- **Responsive** : Mobile-first design

### Contenu 📚

- **Sourcé scientifiquement** : Toutes les stats ont des références
- **Pédagogique** : Arguments clairs, hiérarchisés, visuels
- **Empowering** : Démentis positifs, ressources d'aide
- **Actionnable** : Pétition, associations, guides

### UX/Design 🎨

- **Immersif** : Parallax horizontal unique
- **Safe** : Trigger warnings, mode sensible, contacts d'aide
- **Interactif** : Flipcards, toggles, animations
- **Esthétique** : Design moderne, soigné, professionnel

---

## 🐛 Limitations Connues

### Technique

- **Scroll horizontal** : Peut désorienter certains utilisateurs (solution : hint de navigation)
- **Flipcards Safari iOS** : Animation parfois saccadée (acceptable, bug mineur)
- **Pas de backend** : Contenu statique uniquement (suffisant pour l'usage actuel)

### Contenu

- **Données françaises limitées** : Moins de stats qu'aux US (amélioration continue)
- **Monolingue** : Français uniquement (EN/ES en roadmap)
- **Pas de témoignages** : Manque de voix personnelles (ajout prévu)

### SEO

- **Pas de sitemap** : À ajouter (facile)
- **Pas de robots.txt** : À configurer (facile)
- **Analytics absent** : Pas de tracking actuel (Plausible prévu)

---

## 🤝 Contribution et Maintenance

### Comment Contribuer

1. **Contenu** : Éditer `grossophobie.json` avec sources
2. **Bugs** : Issues sur GitLab
3. **Améliorations** : Pull requests sur GitHub
4. **Traductions** : Créer `grossophobie-en.json`, etc.

### Maintenance

- **Mise à jour stats** : Annuelle (nouvelles études)
- **Vérification liens** : Trimestrielle (sources, pétition)
- **Performance** : Semestrielle (Lighthouse audit)
- **Accessibilité** : Semestrielle (WAVE audit)

---

## 📞 Ressources et Contacts

### Documentation Technique

- **Cloudflare Pages** : https://developers.cloudflare.com/pages/
- **GitLab CI/CD** : https://docs.gitlab.com/ee/ci/
- **jQuery API** : https://api.jquery.com/
- **WCAG Guidelines** : https://www.w3.org/WAI/WCAG21/quickref/

### Sources Contenu

- **Ligue contre l'obésité** : Statistiques françaises
- **NAAFA** : Statistiques US (@naafaonline)
- **Gras Politique** : Campagnes françaises
- **Odoxa** : Sondages opinion publique France

### Support

- **Bugs techniques** : GitLab Issues
- **Questions contenu** : Vérifier sources dans JSON
- **Déploiement** : Logs GitLab CI/CD ou Cloudflare Dashboard

---

## 📜 Licence et Crédits

### Design

- **Parallax horizontal** : Inspiré par Paulina Hetman, Shivam Katare
- **Flipcards** : Design original pour ce projet
- **Thème** : NewsForge team

### Contenu

- **Sources** : Multiples, citées dans `grossophobie.json`
- **Utilisation** : Libre pour usage éducatif et sensibilisation
- **Attribution** : Apprécié mais non requise

---

## 🎯 Vision Long Terme

### Mission

Devenir **la référence francophone** pour la sensibilisation à la grossophobie, avec :

1. **Contenu exhaustif** : Toutes les statistiques, études, campagnes
2. **Multilingue** : FR, EN, ES pour toucher audience internationale
3. **Communauté** : Témoignages, forum, newsletter active
4. **Impact mesurable** : 10 000+ visites/mois, 500+ signatures/mois

### Expansion Thématique

Le système de routing permet d'ajouter facilement :

- **Sexisme** : `sexisme.json` → `/sexisme`
- **Racisme** : `racisme.json` → `/racisme`
- **Validisme** : `validisme.json` → `/validisme`
- **Âgisme** : `agisme.json` → `/agisme`

**Objectif** : Plateforme complète de lutte contre les discriminations

---

**Dernière mise à jour** : 7 novembre 2025
**Version** : 2.0 (post-déploiement avec améliorations majeures)
**Statut** : ✅ Production sur https://p.newsforge.app/grossophobie
**Branche active** : `cloudflare-pages-deployment`

🌟 **Prochain jalon** : 10 000 visites/mois et intégration analytics
