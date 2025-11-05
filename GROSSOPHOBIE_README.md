# Parallax Grossophobie

Un site web pédagogique et interactif pour comprendre, dénoncer et agir contre la stigmatisation liée au poids.

## 🎯 Objectif

Ce site utilise l'effet parallax horizontal pour créer une expérience immersive qui sensibilise à la grossophobie, avec des données scientifiques, des témoignages et des ressources pour différents publics.

## 📋 Contenu

### Sections Principales

1. **Introduction** - Définition de la grossophobie et statistiques globales
2. **Publics Cibles** - Contenu adapté pour :
   - 💪 Jeunes femmes complexées
   - ⚖️ Juristes
   - 🏛️ Élu·e·s
   - 📰 Journalistes

3. **20 Arguments Solides** - Statistiques US et françaises avec sources
4. **Phrases Discriminantes** - Exemples réels avec démentis empowerants (⚠️ Trigger Warning)
5. **Arguments Positifs** - Pourquoi lutter contre la grossophobie bénéficie à tous
6. **Campagnes Efficaces** - 7 campagnes internationales inspirantes
7. **Ressources** - Associations, guides et outils
8. **Appel à l'Action** - Dont la pétition à l'Assemblée Nationale

## 🔧 Fichiers

- `grossophobie.html` - Page principale
- `grossophobie-style.css` - Styles adaptés au thème
- `grossophobie-script.js` - Logique interactive et chargement des données
- `grossophobie.json` - Base de données complète du contenu

## 🚀 Utilisation

### Démarrage Local

1. Ouvrez le fichier `grossophobie.html` dans un navigateur moderne
2. **Important** : Pour que le chargement du JSON fonctionne, vous devez utiliser un serveur local :

```bash
# Option 1 : Avec Python 3
python -m http.server 8000

# Option 2 : Avec Node.js (http-server)
npx http-server

# Option 3 : Avec PHP
php -S localhost:8000
```

3. Accédez à `http://localhost:8000/grossophobie.html`

### Déploiement

Le site peut être déployé sur :
- **Vercel** (configuration déjà présente avec `vercel.json`)
- **Netlify**
- **GitHub Pages**
- N'importe quel hébergeur web statique

## ✨ Fonctionnalités

### 🛡️ Mode Sensible (Safe Mode)

- Active automatiquement un filtre pour masquer les contenus potentiellement déclencheurs
- Masque les phrases discriminantes pour protéger les personnes vulnérables
- Toggle disponible dans la navigation

### ⚠️ Trigger Warning

- Modal d'avertissement au chargement de la page
- Informations sur les contacts d'aide (3114, 0800 235 236)
- Choix entre mode normal et mode sensible

### 🔄 Cartes Interactives

Les phrases discriminantes sont présentées sous forme de cartes flip :
- **Recto** (rouge) : La phrase discriminante
- **Verso** (vert) : Le démenti empowering
- Cliquez pour retourner la carte

### 🎨 Design Accessible

- Contraste élevé pour la lisibilité
- Support du mode "prefers-reduced-motion" pour l'accessibilité
- Navigation au clavier
- Responsive design

### 📱 Navigation

- Menu fixe avec liens de navigation rapide
- Indicateur de scroll
- Sections organisées en parallax horizontal

## 🎨 Personnalisation

### Modifier les Couleurs

Éditez les variables CSS dans `grossophobie-style.css` :

```css
:root {
  --primary-color: #6366f1;    /* Couleur principale */
  --secondary-color: #10b981;   /* Couleur secondaire */
  --warning-color: #f59e0b;     /* Warnings */
  --danger-color: #ef4444;      /* Danger */
  /* ... */
}
```

### Ajouter du Contenu

Éditez `grossophobie.json` pour :
- Ajouter des arguments
- Modifier les statistiques
- Ajouter des campagnes
- Mettre à jour les ressources

Structure exemple pour un nouvel argument :

```json
{
  "id": 21,
  "title": "Nouveau titre",
  "statUS": "Statistique américaine",
  "statFrance": "Statistique française",
  "impact": "Description de l'impact",
  "visual": "icon-name"
}
```

## 📊 Données et Sources

Toutes les statistiques proviennent de sources fiables :

- **France** : Ligue contre l'obésité, Odoxa, Défenseur des droits, CNAO
- **International** : NAAFA, Sport England, études académiques
- **Campagnes** : Analyses d'impact vérifiées (ventes, couverture médiatique, changements législatifs)

## 🌐 Pétition

Le site promeut la pétition officielle à l'Assemblée Nationale :
[https://petitions.assemblee-nationale.fr/initiatives/i-3867?locale=fr](https://petitions.assemblee-nationale.fr/initiatives/i-3867?locale=fr)

## 🤝 Publics Cibles

### Jeunes Femmes Complexées
- Arguments pour déconstruire les normes toxiques
- Démentis empowerants aux phrases discriminantes
- Statistiques pour comprendre le caractère systémique

### Juristes
- Exemples de lois anti-discrimination (NYC, Minneapolis)
- Arguments pour reconnaissance légale
- Impact économique et social mesurable

### Élu·e·s
- Données économiques (273 000 emplois potentiels)
- Coûts sociaux de la discrimination
- ROI de l'inclusion (réduction 20-30% des coûts)

### Journalistes
- Statistiques sourcées et vérifiables
- Bonnes pratiques médiatiques
- Campagnes à mettre en avant

## 🔒 Sécurité Émotionnelle

Le site priorise la sécurité émotionnelle des visiteurs :

1. **Avertissement préalable** - Modal au chargement
2. **Contacts d'aide** - Numéros d'urgence visibles
3. **Mode sensible** - Masquage automatique du contenu difficile
4. **Navigation libre** - Possibilité de passer les sections sensibles
5. **Couleurs douces** - Pas de rouge agressif, design apaisant

## 📱 Compatibilité

- ✅ Chrome, Firefox, Safari, Edge (versions récentes)
- ✅ Mobile et tablette (responsive)
- ✅ Lecture d'écran compatible
- ✅ Navigation au clavier

## 🛠️ Technologies

- **HTML5** - Structure sémantique
- **CSS3** - Animations et parallax
- **JavaScript (jQuery)** - Interactions et chargement dynamique
- **JSON** - Base de données de contenu

## 📈 Améliorations Futures

- [ ] Version multilingue (anglais, espagnol)
- [ ] Section témoignages avec formulaire anonyme
- [ ] Intégration API réseaux sociaux pour partage
- [ ] Analytics pour mesurer l'impact
- [ ] Version imprimable des arguments
- [ ] Quiz interactif sur les préjugés

## 🎓 Utilisation Éducative

Ce site peut être utilisé dans un cadre :
- **Scolaire** - Sensibilisation collèges/lycées
- **Universitaire** - Cours de sociologie, droit, santé publique
- **Professionnel** - Formation RH, management
- **Associatif** - Campagnes de sensibilisation

## 📝 Licence et Crédits

- **Design Parallax** : Inspiré par Paulina Hetman et Shivam Katare
- **Contenu** : Sources multiples citées dans le JSON
- **Utilisation** : Libre pour usage éducatif et sensibilisation

## 🆘 Contacts d'Aide

### France
- **Santé mentale** : 3114 (gratuit, 24/7)
- **Obésité et soutien** : 0800 235 236
- **Associations** :
  - Ligue contre l'obésité
  - CNAO
  - Gras Politique

### International
- **NAAFA** : @naafaonline
- **ÉquiLibre (Québec)** : @equilibre.ca

## 🤝 Contribuer

Pour suggérer des améliorations ou signaler des bugs :
1. Vérifiez que les données sont à jour
2. Proposez des corrections au JSON
3. Suggérez de nouvelles fonctionnalités
4. Partagez des ressources additionnelles

---

**Important** : Ce site est un outil pédagogique. Si vous êtes en détresse, contactez immédiatement les numéros d'urgence mentionnés ci-dessus.

Made with ❤️ for a more inclusive world.
