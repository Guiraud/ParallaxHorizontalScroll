# Parallax Horizontal Scroll - Multi-Format Content Import

Système de parallax horizontal avec support d'import de contenu multi-formats (JSON, YAML, Markdown, XML).

## 🚀 Fonctionnalités

- **Import Multi-Format** : Supporte JSON, YAML, Markdown et XML
- **Analyse IA** : Scores de clarté pour déterminer le meilleur format pour l'IA
- **Sources Traçables** : Support des URLs pour les sources d'information
- **Animations Parallax** : Effets de défilement horizontal et vertical
- **Blocs Variés** : Texte, statistiques, CTA, FAQ, témoignages, timeline

## 📊 Scores de Clarté pour l'IA

| Format | Score | Recommandation |
|--------|-------|----------------|
| **JSON** | **85%** | ⭐ **Optimal pour l'IA** |
| YAML | 75% | Bon pour édition humaine |
| XML | 70% | Bon pour interopérabilité |
| Markdown | 60% | Bon pour documentation |

### Pourquoi JSON est optimal ?

1. **Structure explicite** (90%) : Hiérarchie claire avec accolades et crochets
2. **Parsing déterministe** (95%) : Un seul parser standard, aucune ambiguïté
3. **Typage clair** (80%) : Distinction nette entre types de données
4. **Validation facile** (90%) : JSON Schema pour validation stricte
5. **Interopérabilité** (75%) : Support natif tous langages

## 📁 Structure du Projet

```
ParallaxHorizontalScroll/
├── index.html              # Page principale (démo originale)
├── import-demo.html        # Page de démonstration de l'import ⭐
├── import.md               # Guide complet d'utilisation
├── style.css               # Styles principaux
├── css/
│   └── content-blocks.css  # Styles des blocs importés
├── js/
│   ├── content-importer.js # Parser multi-format
│   └── content-renderer.js # Rendu des blocs
└── examples/
    └── import/
        ├── content.json    # Exemple JSON ⭐
        ├── content.yaml    # Exemple YAML
        ├── content.md      # Exemple Markdown
        └── content.xml     # Exemple XML
```

## 🎯 Démarrage Rapide

### 1. Voir la démo

Ouvrez `import-demo.html` dans votre navigateur pour tester l'import en direct.

### 2. Essayer les formats

Cliquez sur les boutons pour charger le contenu dans différents formats :
- **JSON** (85% - Recommandé pour IA)
- **YAML** (75% - Lisible pour humains)
- **XML** (70% - Interopérable)
- **Markdown** (60% - Documentation)

### 3. Importer vos fichiers

1. Cliquez sur "📁 Upload Custom File"
2. Sélectionnez un fichier `.json`, `.yaml`, `.md` ou `.xml`
3. Le contenu s'affiche automatiquement avec l'effet parallax

## 📖 Documentation

Consultez le fichier **[import.md](import.md)** pour :
- Structure détaillée des données
- Types de blocs disponibles
- Guide d'intégration
- Exemples de code
- API complète

## 🎨 Types de Blocs Supportés

### 1. Text Block
Bloc de texte simple (hero, paragraphe, footer)

```json
{
  "type": "text_block",
  "subtype": "hero",
  "content": {
    "title": "Titre",
    "text": "Contenu"
  }
}
```

### 2. Card Block
Bloc encadré (stats, CTA, FAQ)

```json
{
  "type": "card_block",
  "subtype": "stats",
  "content": {
    "stats": [
      {"value": "66%", "label": "Description"}
    ]
  }
}
```

### 3. Parallax Vertical
Frise chronologique verticale

```json
{
  "type": "parallax_vertical",
  "subtype": "timeline",
  "content": {
    "items": [
      {"year": "2024", "title": "Événement"}
    ]
  }
}
```

### 4. Parallax Horizontal
Témoignages avec défilement horizontal

```json
{
  "type": "parallax_horizontal",
  "subtype": "testimonials",
  "content": {
    "items": [
      {"quote": "Citation", "author": "Nom"}
    ]
  }
}
```

### 5. Popup Group
Popups avec déclencheurs

```json
{
  "type": "popup_group",
  "content": {
    "popups": [
      {
        "trigger": "scroll_50",
        "message": "Message",
        "button": {"text": "Action", "action": "scroll_to_cta"}
      }
    ]
  }
}
```

## 🔗 Sources d'Information

Chaque bloc peut inclure des sources avec URLs :

```json
{
  "sources": [
    {
      "type": "study",
      "title": "Nom de l'étude",
      "url": "https://example.com/study"
    }
  ]
}
```

Types de sources : `study`, `report`, `statistical_report`, `medical_study`, `legislation`, `official`, `organization`

## 💻 Utilisation Programmatique

### Import JavaScript

```javascript
// Créer l'importeur
const importer = new ContentImporter();

// Importer depuis URL
const data = await importer.import('examples/import/content.json');

// Importer depuis File
const file = document.getElementById('input').files[0];
const data = await importer.import(file);

// Rendre le contenu
const renderer = new ContentRenderer(container);
renderer.render(data);
```

### Validation

```javascript
// Le parser valide automatiquement :
// - Présence de blocks[]
// - Champs requis (id, type, content)
// - Structure correcte selon le type
```

## 🎨 Personnalisation CSS

Les styles sont dans `css/content-blocks.css` :

```css
/* Personnaliser les blocs */
.text-block .text-content { /* ... */ }
.card-block .card { /* ... */ }
.testimonial { /* ... */ }
```

## 🧪 Tests

### Tester un format

```javascript
// Afficher les scores de clarté
console.log(ContentImporter.getFormatScores());

// Tester le parsing
const importer = new ContentImporter();
const data = await importer.import('examples/import/content.json');
console.log('Parsed data:', data);
```

### Exemple de contenu

Les fichiers dans `examples/import/` contiennent un exemple complet de campagne de pétition avec :
- Hero (introduction)
- Statistiques clés
- Call-to-action
- FAQ
- Témoignages
- Timeline
- Popups

## 📚 Ressources

- **[import.md](import.md)** - Guide complet
- **[import-demo.html](import-demo.html)** - Démo interactive
- **[examples/import/](examples/import/)** - Fichiers exemples

## 🤝 Contribution

Pour ajouter un nouveau format :

1. Ajouter le parser dans `content-importer.js`
2. Ajouter l'extension dans `supportedFormats`
3. Créer un fichier exemple dans `examples/import/`
4. Mettre à jour la documentation

## 📄 Licence

Ce projet inclut du code inspiré de [Paulina Hetman](https://codepen.io/pehaa/pen/zYxbxQg).

## 🎯 Cas d'Usage

### Pour les développeurs
- Import rapide de contenu structuré
- API REST avec JSON
- Configuration avec YAML

### Pour les créateurs de contenu
- Édition simple avec Markdown
- Validation automatique
- Preview en temps réel

### Pour l'IA
- **JSON recommandé** (85% de clarté)
- Structure explicite
- Parsing déterministe

---

**Version :** 1.0
**Date :** 2024-11-05

Made with ❤ by Shivam Katare (original parallax) + Multi-format import system
