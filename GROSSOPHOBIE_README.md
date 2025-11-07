# Parallax Grossophobie

Un site web pédagogique et interactif pour comprendre, dénoncer et agir contre la stigmatisation liée au poids.

---

## 🎯 Objectif

Ce site utilise l'effet **parallax horizontal** pour créer une expérience immersive qui sensibilise à la grossophobie, avec des données scientifiques, des témoignages et des ressources pour différents publics.

**URL Production** : https://p.newsforge.app/grossophobie

---

## 📋 Contenu

### Sections Principales

1. **Introduction** - Définition de la grossophobie et statistiques globales (8M de Français affectés)

2. **Publics Cibles** - Contenu adapté pour :
   - 💪 **Jeunes femmes complexées** : Déconstruction des normes toxiques
   - ⚖️ **Juristes** : Arguments légaux, exemples de lois anti-discrimination
   - 🏛️ **Élu·e·s** : Impact économique, coûts sociaux, ROI de l'inclusion
   - 📰 **Journalistes** : Bonnes pratiques médiatiques, statistiques sourcées

3. **20 Arguments Solides**
   - **Format flipcard** : Recto (statistique française) / Verso (statistique US)
   - **Drapeau interactif** : Clic pour basculer FR ↔ US
   - **Sources scientifiques** : Toutes les stats ont des références académiques
   - **Visuels** : Icônes pour catégoriser les arguments

4. **IMC Critique**
   - Historique de l'IMC et ses limitations
   - Dimension raciale : Biais occidentaux et raciaux
   - Alternatives : HAES (Health At Every Size), approches holistiques
   - Sources académiques pour chaque point

5. **Phrases Discriminantes** ⚠️ *Trigger Warning*
   - **Exemples réels** de phrases grossophobes
   - **Démentis empowerants** avec sources scientifiques
   - **Toggle de masquage** : Bouton pour cacher/afficher le contenu sensible
   - **Mode sensible** : Protection des personnes vulnérables

6. **Arguments Positifs** - Pourquoi lutter contre la grossophobie bénéficie à tous
   - Santé publique
   - Justice sociale
   - Économie
   - Bien-être collectif

7. **Campagnes Efficaces** - 7 campagnes internationales inspirantes
   - **Dove "Real Beauty"** : +700% de ventes
   - **#DropThePlus** : Fin des sections "grande taille"
   - **Target "All In Motion"** : Extension tailles jusqu'à 4X
   - **Aerie "Real"** : +32% de ventes
   - **Lois NYC/Minneapolis** : Interdiction discrimination poids
   - **NHS "Healthy Weight"** : Approche non-stigmatisante
   - **This Girl Can** : +2.8M de femmes actives
   - Chaque campagne avec **sources d'impact** mesurables

8. **Ressources**
   - Associations françaises et internationales
   - Guides et rapports scientifiques
   - Contacts d'aide et de soutien
   - Liens vers la pétition

9. **Appel à l'Action**
   - **Pétition Assemblée Nationale** : Lien direct
   - **Associations** : Comment s'engager
   - **Éducation** : Ressources pour sensibiliser
   - **Badge flottant** : Accès rapide à la pétition

---

## 🔧 Fichiers

### Production (Cloudflare Pages)
- `template.html` - Template universel pour routing dynamique
- `functions/[[route]].js` - Cloudflare Pages Function (routing)

### Développement Local
- `grossophobie.html` - Page HTML standalone
- `grossophobie-script.js` - Logique interactive et chargement des données
- `grossophobie-style.css` - Styles thème sombre (défaut)
- `grossophobie-style-light.css` - Styles thème clair
- `grossophobie.json` - Base de données complète du contenu (67 KB)

### Configuration
- `wrangler.toml` - Configuration Wrangler CLI
- `.gitlab-ci.yml` - Pipeline CI/CD GitLab → Cloudflare
- `_redirects` - Règles de redirection Cloudflare

---

## 🚀 Utilisation

### Accès Production

Simplement ouvrir : https://p.newsforge.app/grossophobie

Le site est déployé automatiquement via **GitLab CI/CD** sur **Cloudflare Pages**.

### Développement Local

Pour tester des modifications en local :

```bash
# 1. Lancer un serveur local
python3 -m http.server 8000

# Ou avec Node.js
npx http-server

# Ou avec PHP
php -S localhost:8000
```

2. Accédez à `http://localhost:8000/grossophobie.html`

**Important** : Un serveur local est nécessaire pour le chargement du fichier JSON.

### Modifier le Contenu

```bash
# 1. Éditer le fichier JSON
vim grossophobie.json

# 2. Tester localement
python3 -m http.server 8000

# 3. Committer et déployer
git add grossophobie.json
git commit -m "Update: description des changements"
git deploy  # Push vers GitHub + GitLab

# 4. Le site est automatiquement redéployé en 1-2 minutes
```

---

## ✨ Fonctionnalités

### 🛡️ Sécurité Émotionnelle

#### Modal d'Avertissement (Trigger Warning)
- **Affichage au chargement** : Avertit du contenu potentiellement difficile
- **Contacts d'aide intégrés** :
  - 🇫🇷 Santé mentale : **3114** (gratuit, 24/7)
  - 🇫🇷 Obésité et soutien : **0800 235 236**
- **Choix dual** : Continuer en mode normal ou activer le mode sensible
- **Design mobile optimisé** : Layout adaptatif pour petits écrans

#### Mode Sensible (Safe Mode)
- **Toggle dans la navigation** : Activation/désactivation facile
- **Masquage automatique** : Filtre les contenus difficiles
- **Protection des personnes vulnérables** : Expérience sécurisée

#### Toggle Phrases Discriminantes
- **Bouton contextuel** : Dans la bannière trigger warning de la section Phrases
- **Effet visuel** : Blur 20px + opacité 30% pour masquer
- **Icône dynamique** :
  - 👁️ "Masquer" (contenu visible)
  - 👁️‍🗨️ "Afficher" (contenu caché)
- **Persistance** : État maintenu pendant la session

### 🔄 Cartes Interactives (Flipcards)

Les **20 arguments** sont présentés sous forme de cartes à retourner :

- **Recto (face française)** 🇫🇷 : Statistique ou fait en France
- **Verso (face US)** 🇺🇸 : Statistique ou fait aux États-Unis
- **Interaction** : Clic sur drapeau pour retourner la carte
- **Animation fluide** : Rotation 3D avec transition
- **Mobile optimisé** : Hauteur dynamique, pas de superposition
- **Sources** : Liens vers études scientifiques pour chaque stat

**Exemple** :
```
🇫🇷 RECTO : "47% des Français en surpoids (Ligue contre l'obésité)"
🇺🇸 VERSO : "42% des Américains obèses (CDC 2020)"
```

### 🎨 Design et Expérience

#### Thème Clair/Sombre
- **Toggle dans la navigation** : Icône 🌙 / ☀️
- **Persistance** : Préférence sauvegardée dans localStorage
- **Transitions fluides** : Changement de couleurs smooth
- **Deux CSS distincts** :
  - `grossophobie-style.css` (sombre, défaut)
  - `grossophobie-style-light.css` (clair)

#### Navigation
- **Menu fixe** : Toujours accessible en haut
- **Burger mobile** : Menu responsive sur petits écrans
- **Table des matières** : Sommaire fixe sur desktop (gauche)
- **Breadcrumbs** : Fil d'Ariane (Accueil > NewsForge > Grossophobie)
- **Scroll hints** : Indices visuels pour le défilement horizontal

#### Badge Pétition Flottant
- **Position fixe** : Bas à droite de l'écran
- **Toujours visible** : Sur toutes les sections
- **Tooltip** : Message informatif au survol
- **Animation pulse** : Attire l'attention sans être intrusif
- **Lien direct** : Vers pétition Assemblée Nationale

#### Effet Parallax Horizontal
- **Défilement unique** : Gauche → Droite (← scroll →)
- **Vitesses variées** : Profondeur visuelle (slower, normal, faster)
- **Sections progressives** : Révélation fluide du contenu
- **Immersif** : Expérience narrative engageante

### 📊 Accessibilité et SEO

#### WCAG Compliance
- **Aria labels** : Sur tous les boutons et liens
- **Navigation clavier** : Tab, Enter, Esc fonctionnent
- **Contraste élevé** : WCAG AAA sur textes principaux
- **Alt texts** : Images décrites (si présentes)
- **Focus visible** : Indication claire de l'élément actif

#### SEO Optimisé
- **Meta description** : 160 caractères optimisés
- **Open Graph** : Partage Facebook/LinkedIn optimisé
- **Twitter Cards** : Preview Twitter enrichie
- **Schema.org** : Métadonnées structurées (WebPage, HowTo, Article)
- **Breadcrumbs** : Navigation hiérarchique SEO-friendly

### 🇫🇷 Typographie Française

Respect des règles typographiques françaises :

- **Espaces insécables** : Avant `:`, `!`, `?`, `;`
- **Format** : U+00A0 (non-breaking space)
- **Application** : JSON, HTML, JavaScript
- **Exemples** :
  - ❌ "Qu'est-ce que la grossophobie ?" (espace normal)
  - ✅ "Qu'est-ce que la grossophobie ?" (espace insécable)

### 📱 Responsive Design

- **Mobile-first** : Optimisé pour smartphones d'abord
- **Breakpoints** :
  - Mobile : < 768px
  - Tablette : 768px - 1024px
  - Desktop : > 1024px
- **Flipcards mobiles** :
  - Min-height : 200px (évite superposition)
  - Hauteur dynamique : Calcul auto basé sur contenu
  - Touch-friendly : Zone de clic élargie
- **Navigation burger** : Menu hamburger sur mobile
- **Modal adaptatif** : Layout colonne sur petits écrans

---

## 🎨 Personnalisation

### Modifier les Couleurs

Éditez les variables CSS dans `grossophobie-style.css` (thème sombre) ou `grossophobie-style-light.css` (thème clair) :

```css
:root {
  --primary-color: #6366f1;      /* Couleur principale (bleu indigo) */
  --secondary-color: #10b981;     /* Couleur secondaire (vert) */
  --warning-color: #f59e0b;       /* Warnings (orange) */
  --danger-color: #ef4444;        /* Danger (rouge) */
  --bg-dark: #0f172a;             /* Fond sombre */
  --bg-light: #f8fafc;            /* Fond clair */
  --text-dark: #1e293b;           /* Texte sur fond clair */
  --text-light: #f1f5f9;          /* Texte sur fond sombre */
}
```

### Ajouter du Contenu

Éditez `grossophobie.json` pour :

#### Ajouter un Argument

```json
{
  "arguments": [
    {
      "id": 21,
      "title": "Nouveau titre de l'argument",
      "statFrance": "47% des Français... (Source)",
      "statUS": "42% des Américains... (Source)",
      "impact": "Description de l'impact",
      "visual": "📊",
      "sourceFrance": "https://lien-vers-etude-francaise.fr",
      "sourceUS": "https://lien-vers-etude-us.com"
    }
  ]
}
```

#### Ajouter une Phrase Discriminante

```json
{
  "phrases": [
    {
      "id": 11,
      "phrase": "Phrase discriminante exemple",
      "reponse": "Démenti empowering avec faits scientifiques",
      "source": "https://lien-vers-etude.com",
      "categorie": "Santé"
    }
  ]
}
```

#### Ajouter une Campagne

```json
{
  "campagnes": [
    {
      "id": 8,
      "titre": "Nom de la Campagne",
      "marque": "Nom de la Marque",
      "annee": 2024,
      "description": "Description de la campagne",
      "impact": "Impact mesurable (ventes, législation, etc.)",
      "source": "https://lien-vers-rapport-impact.com",
      "lecon": "Ce qu'on peut en tirer"
    }
  ]
}
```

**Important** : Toujours inclure des **sources vérifiables** pour chaque statistique.

---

## 📊 Données et Sources

Toutes les statistiques proviennent de sources fiables et vérifiables :

### Sources Françaises
- **Ligue contre l'obésité** : Statistiques nationales
- **Odoxa** : Sondages opinion publique
- **Défenseur des droits** : Discrimination et emploi
- **CNAO (Collectif National des Associations d'Obèses)** : Témoignages et études
- **INSERM** : Recherches médicales

### Sources Internationales
- **NAAFA** (National Association to Advance Fat Acceptance)
- **Sport England** : Études sur l'activité physique
- **CDC** (Centers for Disease Control) : Statistiques santé US
- **Études académiques** : Journals peer-reviewed

### Campagnes
- **Rapports d'impact** : Données de ventes, couverture médiatique
- **Législation** : Textes de loi NYC, Minneapolis
- **Métriques** : Augmentation de participation, changements comportementaux

---

## 🌐 Pétition

Le site promeut activement la **pétition officielle à l'Assemblée Nationale** :

🔗 https://petitions.assemblee-nationale.fr/initiatives/i-3867?locale=fr

**Objectif** : Reconnaissance légale de la grossophobie comme discrimination

**Visibilité** :
- Lien dans le modal d'avertissement
- Section Hero (haut de page)
- Badge flottant (toujours visible)
- Section "Agir" (call-to-action)

---

## 🤝 Publics Cibles

### 💪 Jeunes Femmes Complexées

**Besoins** : Déconstruction des normes toxiques, empowerment

**Contenu** :
- Arguments pour comprendre le caractère systémique
- Démentis empowerants aux phrases discriminantes
- Ressources de soutien (3114, associations)

**Ton** : Bienveillant, rassurant, positif

### ⚖️ Juristes

**Besoins** : Arguments légaux, précédents, reconnaissance juridique

**Contenu** :
- Exemples de lois anti-discrimination (NYC, Minneapolis)
- Jurisprudence sur discrimination poids
- Impact économique mesurable

**Ton** : Factuel, précis, références solides

### 🏛️ Élu·e·s

**Besoins** : Données économiques, coûts sociaux, ROI

**Contenu** :
- 273 000 emplois potentiels (étude)
- Coûts de la discrimination (santé, économie)
- ROI de l'inclusion : 20-30% de réduction coûts

**Ton** : Stratégique, chiffré, impactant

### 📰 Journalistes

**Besoins** : Statistiques sourcées, bonnes pratiques, campagnes

**Contenu** :
- Toutes les stats ont des sources cliquables
- Bonnes pratiques médiatiques (éviter stigmatisation)
- Campagnes efficaces à mettre en avant

**Ton** : Informatif, neutre, vérifiable

---

## 🔒 Sécurité Émotionnelle

Le site priorise la **sécurité émotionnelle** des visiteurs :

1. **Avertissement préalable** : Modal au chargement avec trigger warning
2. **Contacts d'aide visibles** : Numéros d'urgence (3114, 0800 235 236)
3. **Mode sensible** : Masquage automatique du contenu difficile
4. **Toggle contextuel** : Contrôle sur l'affichage des phrases discriminantes
5. **Navigation libre** : Possibilité de passer les sections sensibles
6. **Couleurs douces** : Design apaisant, pas de rouge agressif
7. **Ton bienveillant** : Démentis empowerants, jamais culpabilisants

**Principe** : Informer sans traumatiser, sensibiliser sans choquer

---

## 📱 Compatibilité

### Navigateurs
- ✅ **Chrome** 90+ (recommandé)
- ✅ **Firefox** 88+
- ✅ **Safari** 14+
- ✅ **Edge** 90+

### Devices
- ✅ **Desktop** : 1920x1080 et supérieur
- ✅ **Laptop** : 1366x768 minimum
- ✅ **Tablette** : iPad et Android tablets
- ✅ **Mobile** : iPhone 6+ et équivalents Android

### Accessibilité
- ✅ **Lecteurs d'écran** : NVDA, JAWS, VoiceOver
- ✅ **Navigation clavier** : Tab, Enter, Esc
- ✅ **Zoom** : 200% sans perte de fonctionnalité
- ✅ **Contraste** : WCAG AAA

---

## 🛠️ Technologies

### Frontend
- **HTML5** : Structure sémantique (nav, aside, section, article)
- **CSS3** :
  - Variables CSS pour théming
  - Flexbox et Grid pour layouts
  - Animations et transitions
  - Media queries pour responsive
- **JavaScript ES6+** :
  - Modules
  - Arrow functions
  - Template literals
  - Async/await (pour fetch JSON)

### Bibliothèques
- **jQuery 3.6.0** : Manipulation DOM, AJAX, animations

### Données
- **JSON** : Base de données de contenu structuré (67 KB)

### Infrastructure
- **Cloudflare Pages** : Hébergement sur CDN global
- **Cloudflare Pages Functions** : Routing dynamique serverless
- **GitLab CI/CD** : Déploiement automatique

### Fonts
- **Google Fonts** :
  - Merriweather (700) : Titres
  - Merriweather (300 italic) : Citations
  - Raleway (400, 700, 800) : Texte courant

### Icons
- **Unicode Emojis** : Icônes natives multi-plateforme

---

## 📈 Améliorations Récentes

### Novembre 2025

#### Sécurité Émotionnelle
- ✅ **Toggle contenu sensible** : Masquage phrases discriminantes
- ✅ **Modal mobile optimisé** : Layout adaptatif petits écrans

#### Contenu
- ✅ **Sources scientifiques** : Toutes les stats référencées
  - 20 arguments avec liens vers études
  - Phrases avec sources de démentis
  - Campagnes avec rapports d'impact
- ✅ **Section IMC optimisée** : Suppression bloc intro redondant

#### Mobile
- ✅ **Flipcards corrigées** : Superposition fixée
- ✅ **Hauteur dynamique** : Calcul auto pour éviter débordements

#### Design
- ✅ **Typographie française** : Espaces insécables avant ponctuations
- ✅ **Badge pétition** : Tooltip informatif

### Octobre 2025

- ✅ **Flipcards Arguments** : Design interactif FR/US
- ✅ **SEO complet** : Open Graph, Twitter Cards, Schema.org
- ✅ **Section IMC** : Critique de l'IMC avec dimension raciale
- ✅ **Toggle thème** : Clair/Sombre avec persistance
- ✅ **Menu burger** : Navigation mobile responsive

---

## 📝 Améliorations Futures

### Priorité Haute 🔴

- [ ] **Analytics** : Plausible ou Matomo (RGPD-compliant)
  - Pages vues, temps sur site
  - Taux de conversion pétition
  - Parcours utilisateur

- [ ] **Performance** : Optimisation assets
  - Lazy loading images
  - Minification CSS/JS
  - Compression gzip/brotli

- [ ] **Sitemap XML** : Améliorer indexation Google

### Priorité Moyenne 🟡

- [ ] **Multilingue** : Versions EN et ES
  - `grossophobie-en.json`
  - `grossophobie-es.json`
  - Toggle de langue dans navigation

- [ ] **Partage social** : Faciliter diffusion
  - Boutons Twitter, Facebook, LinkedIn
  - Citations partageables (tweet-sized)

- [ ] **Témoignages** : Section participative
  - Formulaire anonyme (Google Forms / Netlify Forms)
  - Modération avant publication
  - Affichage dynamique

### Priorité Basse 🟢

- [ ] **Quiz interactif** : Tester connaissances
  - Questions basées sur les 20 arguments
  - Score et feedback personnalisé
  - Partage des résultats

- [ ] **Version imprimable** : PDF téléchargeable
  - Synthèse des 20 arguments
  - Format A4, prêt à imprimer
  - CTA vers pétition

- [ ] **Newsletter** : Capture emails
  - Popup non-invasif
  - Intégration Mailchimp/Sendinblue
  - Contenu mensuel (actualités anti-grossophobie)

---

## 🎓 Utilisation Éducative

Ce site peut être utilisé dans un cadre :

### 🏫 Scolaire
- **Collèges/Lycées** : Sensibilisation aux discriminations
- **Cours** : EMC (Enseignement Moral et Civique)
- **Projets** : TPE, exposés sur les discriminations

### 🎓 Universitaire
- **Sociologie** : Étude des normes sociales et stigmatisation
- **Droit** : Discrimination et législation
- **Santé publique** : Impact de la stigmatisation sur la santé
- **Sciences de l'éducation** : Pédagogie anti-discriminatoire

### 💼 Professionnel
- **Formation RH** : Prévention des discriminations à l'embauche
- **Management** : Inclusion et diversité
- **Santé** : Formation des professionnels de santé

### 🤝 Associatif
- **Campagnes de sensibilisation** : Matériel pédagogique
- **Événements** : Conférences, ateliers
- **Plaidoyer** : Arguments pour lobbying législatif

---

## 📝 Licence et Crédits

### Design
- **Parallax horizontal** : Inspiré par Paulina Hetman et Shivam Katare
- **Flipcards** : Design original pour ce projet
- **Interface** : NewsForge team

### Contenu
- **Sources** : Multiples, citées dans `grossophobie.json`
- **Utilisation** : **Libre** pour usage éducatif et sensibilisation
- **Attribution** : Appréciée mais non requise

### Technologies
- **jQuery** : MIT License
- **Google Fonts** : Open Font License
- **Cloudflare** : Commercial license

---

## 🆘 Contacts d'Aide

### 🇫🇷 France

#### Urgences
- **Santé mentale** : **3114** (gratuit, 24/7, anonyme)
- **Obésité et soutien** : **0800 235 236**

#### Associations
- **Ligue contre l'obésité** : https://liguecontrelobesite.org/
- **CNAO** : Collectif National des Associations d'Obèses
- **Gras Politique** : Activisme body-positive
- **En Chairs et en Os** : Association militante

### 🌍 International

- **NAAFA** (US) : @naafaonline
- **ÉquiLibre** (Québec) : @equilibre.ca
- **HAES Community** : haescommunity.com

---

## 🤝 Contribuer

### Comment Contribuer

1. **Signaler un bug** : Créer une issue sur GitLab
2. **Proposer une amélioration** : Pull request sur GitHub
3. **Corriger les données** : Éditer `grossophobie.json` avec sources
4. **Ajouter des ressources** : Compléter section `ressources` du JSON
5. **Traductions** : Créer `grossophobie-en.json`, `grossophobie-es.json`

### Guidelines

- **Sources obligatoires** : Toute statistique doit avoir une source vérifiable
- **Accessibilité** : Maintenir Lighthouse > 95/100
- **Mobile-first** : Tester sur mobile avant desktop
- **Safe mode** : Respecter la sécurité émotionnelle
- **Typographie** : Espaces insécables avant `:`, `!`, `?`, `;`

### Tests

Avant de commit :

```bash
# 1. Tester en local
python3 -m http.server 8000

# 2. Vérifier responsive (Chrome DevTools)
# - Mobile (375px)
# - Tablette (768px)
# - Desktop (1920px)

# 3. Tester navigateurs
# - Chrome
# - Firefox
# - Safari

# 4. Lighthouse audit
# - Performance > 90
# - Accessibility > 95
# - Best Practices > 90
# - SEO > 95
```

---

## 📞 Support

### Bugs Techniques
- **GitLab Issues** : Signaler les bugs
- **Logs CI/CD** : Vérifier logs GitLab pour échecs de build
- **Cloudflare Dashboard** : Consulter logs de déploiement

### Contenu
- **Vérifier sources** : Tous les liens sont dans `grossophobie.json`
- **Études scientifiques** : Citer uniquement sources peer-reviewed
- **Mise à jour stats** : Annuellement pour rester à jour

### Déploiement
- **GitLab CI/CD** : Pipeline automatique sur push
- **Cloudflare Pages** : Rebuild en 1-2 minutes
- **Test staging** : `wrangler pages dev .` en local

---

**Important** : Ce site est un outil pédagogique. Si vous êtes en détresse, contactez immédiatement les numéros d'urgence mentionnés ci-dessus.

---

**Dernière mise à jour** : 7 novembre 2025
**Version** : 2.0 (production)
**URL** : https://p.newsforge.app/grossophobie
**Statut** : ✅ En ligne et actif

💜 Made with care for a more inclusive world.
