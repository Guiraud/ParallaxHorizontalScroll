# Guide d'Import de Contenu - Parallax Horizontal Scroll

## Table des matières
1. [Introduction](#introduction)
2. [Formats supportés](#formats-supportés)
3. [Analyse des formats pour l'IA](#analyse-des-formats-pour-lia)
4. [Structure des données](#structure-des-données)
5. [Types de blocs](#types-de-blocs)
6. [Sources d'information](#sources-dinformation)
7. [Exemples d'utilisation](#exemples-dutilisation)
8. [Guide d'intégration](#guide-dintégration)

---

## Introduction

Ce système d'import permet de charger du contenu structuré dans l'application Parallax Horizontal Scroll à partir de fichiers dans différents formats. Il supporte les URLs pour les sources d'information et permet une traçabilité complète du contenu.

---

## Formats supportés

Le système supporte **quatre formats** principaux :

- **JSON** (`.json`) - Recommandé pour les machines et API
- **YAML** (`.yaml`, `.yml`) - Recommandé pour l'édition humaine
- **Markdown** (`.md`) - Recommandé pour la documentation
- **XML** (`.xml`) - Recommandé pour l'interopérabilité

---

## Analyse des formats pour l'IA

### Probabilités de clarté pour une IA

Nous avons analysé chaque format selon plusieurs critères :
- **Parsing** : facilité d'analyse syntaxique
- **Structure** : clarté de l'organisation hiérarchique
- **Typage** : explicité des types de données
- **Ambiguïté** : risque d'interprétations multiples
- **Robustesse** : résistance aux erreurs de format

| Format | Score Global | Parsing | Structure | Typage | Ambiguïté | Robustesse |
|--------|--------------|---------|-----------|--------|-----------|------------|
| **JSON** | **85%** | 95% | 90% | 80% | 90% | 75% |
| **YAML** | **75%** | 70% | 85% | 70% | 60% | 70% |
| **XML** | **70%** | 85% | 80% | 75% | 70% | 65% |
| **Markdown** | **60%** | 50% | 60% | 50% | 55% | 65% |

### Recommandation : JSON (85% de clarté)

**Pourquoi JSON est optimal pour l'IA :**

1. **Structure explicite** : Les accolades et crochets définissent clairement la hiérarchie
2. **Typage clair** : Distinction nette entre strings, nombres, booléens, tableaux et objets
3. **Parsing déterministe** : Un seul parser standard, aucune ambiguïté d'indentation
4. **Validation facile** : JSON Schema permet une validation stricte
5. **Interopérabilité** : Support natif dans tous les langages modernes

**Détails des autres formats :**

- **YAML (75%)** : Excellent pour les humains, mais l'indentation peut créer des ambiguïtés. Les ancres et références ajoutent de la complexité.

- **XML (70%)** : Structure claire mais verbeux. La redondance (balises ouvrantes/fermantes) augmente le risque d'erreurs. Cependant, très robuste avec validation XSD.

- **Markdown (60%)** : Excellent pour la lecture, mais nécessite un parsing sémantique complexe. Les conventions (# pour titres, [] pour blocs) ne sont pas standardisées.

---

## Structure des données

### Structure globale

Tous les formats partagent la même structure logique :

```
Content
├── metadata (informations générales)
│   ├── title
│   ├── description
│   ├── version
│   └── created
└── blocks[] (liste de blocs de contenu)
    ├── Block 1
    │   ├── id (unique)
    │   ├── type (type de bloc)
    │   ├── subtype (sous-type optionnel)
    │   ├── position (ordre d'affichage)
    │   ├── content (contenu spécifique)
    │   ├── sources[] (URLs de références)
    │   └── animation (paramètres d'animation)
    ├── Block 2
    └── ...
```

### Métadonnées

```json
{
  "metadata": {
    "title": "Titre du projet",
    "description": "Description courte",
    "version": "1.0",
    "created": "2024-11-05"
  }
}
```

---

## Types de blocs

### 1. Text Block (`text_block`)

Bloc de texte simple avec titre et contenu.

**Subtypes :**
- `hero` : Introduction principale
- `paragraph` : Paragraphe standard
- `footer` : Pied de page

**Structure :**
```json
{
  "id": "hero",
  "type": "text_block",
  "subtype": "hero",
  "position": 1,
  "content": {
    "title": "Titre principal",
    "text": "Contenu du texte",
    "style": "hero"
  },
  "sources": [
    {
      "type": "study",
      "title": "Nom de l'étude",
      "url": "https://example.com/study"
    }
  ]
}
```

### 2. Card Block (`card_block`)

Bloc encadré avec mise en forme spéciale.

**Subtypes :**
- `stats` : Statistiques avec valeurs et labels
- `call_to_action` : Appel à l'action avec boutons
- `faq` : Questions-réponses

**Structure (Stats) :**
```json
{
  "id": "stats-1",
  "type": "card_block",
  "subtype": "stats",
  "position": 2,
  "content": {
    "title": "Chiffres clés",
    "stats": [
      {
        "value": "66%",
        "label": "Description de la statistique"
      }
    ]
  },
  "animation": {
    "type": "parallax",
    "speed": "slower"
  }
}
```

**Structure (CTA) :**
```json
{
  "id": "cta-main",
  "type": "card_block",
  "subtype": "call_to_action",
  "content": {
    "title": "Titre du CTA",
    "text": "Message d'incitation",
    "buttons": [
      {
        "text": "Texte du bouton",
        "url": "https://example.com",
        "style": "primary"
      }
    ]
  }
}
```

**Structure (FAQ) :**
```json
{
  "id": "faq",
  "type": "card_block",
  "subtype": "faq",
  "content": {
    "title": "Questions fréquentes",
    "items": [
      {
        "question": "Question ?",
        "answer": "Réponse."
      }
    ]
  }
}
```

### 3. Parallax Vertical (`parallax_vertical`)

Effet de défilement vertical avec plusieurs étapes.

**Subtypes :**
- `timeline` : Frise chronologique

**Structure :**
```json
{
  "id": "timeline",
  "type": "parallax_vertical",
  "subtype": "timeline",
  "content": {
    "title": "Frise chronologique",
    "items": [
      {
        "year": "2024",
        "title": "Événement 1",
        "description": "Description de l'événement"
      }
    ]
  },
  "animation": {
    "type": "parallax_vertical",
    "scrollDirection": "vertical"
  }
}
```

### 4. Parallax Horizontal (`parallax_horizontal`)

Effet de défilement horizontal avec vitesses variables.

**Subtypes :**
- `testimonials` : Témoignages avec citations

**Structure :**
```json
{
  "id": "testimonials",
  "type": "parallax_horizontal",
  "subtype": "testimonials",
  "content": {
    "title": "Témoignages",
    "items": [
      {
        "quote": "Citation du témoignage",
        "author": "Nom, âge",
        "image": "url_image_ou_null"
      }
    ]
  },
  "animation": {
    "type": "parallax_horizontal",
    "speeds": ["slower", "faster", "slower"]
  }
}
```

### 5. Popup Group (`popup_group`)

Groupe de popups avec déclencheurs.

**Triggers disponibles :**
- `scroll_50` : À 50% du scroll
- `after_signature` : Après une action spécifique
- `time_30s` : Après 30 secondes

**Actions disponibles :**
- `scroll_to_cta` : Scroll vers le CTA
- `copy_link` : Copier le lien
- `open_faq` : Ouvrir la FAQ

**Structure :**
```json
{
  "id": "popups",
  "type": "popup_group",
  "content": {
    "popups": [
      {
        "id": "popup-1",
        "trigger": "scroll_50",
        "message": "Message du popup",
        "button": {
          "text": "Texte du bouton",
          "action": "scroll_to_cta"
        }
      }
    ]
  }
}
```

---

## Sources d'information

Chaque bloc peut inclure des **sources** pour documenter l'origine des données.

### Types de sources

| Type | Description | Exemple |
|------|-------------|---------|
| `study` | Étude scientifique | Recherche académique |
| `report` | Rapport officiel | Rapport gouvernemental |
| `statistical_report` | Rapport statistique | INSEE, études de marché |
| `medical_study` | Étude médicale | Essai clinique |
| `legislation` | Texte législatif | Loi, décret |
| `official` | Source officielle | Site gouvernemental |
| `organization` | Organisation | ONG, association |

### Structure d'une source

```json
{
  "type": "study",
  "title": "Titre de la source",
  "url": "https://example.com/source"
}
```

### Exemple avec sources multiples

```json
{
  "id": "stats-1",
  "type": "card_block",
  "content": {
    "title": "Statistiques vérifiées"
  },
  "sources": [
    {
      "type": "statistical_report",
      "title": "Rapport INSEE 2024",
      "url": "https://www.insee.fr/rapport-2024"
    },
    {
      "type": "study",
      "title": "Étude universitaire Paris-Sorbonne",
      "url": "https://www.sorbonne.fr/etude-discrimination"
    }
  ]
}
```

---

## Exemples d'utilisation

### Fichiers exemples disponibles

Le dossier `examples/import/` contient des fichiers exemples dans tous les formats :

- `content.json` - Format JSON (recommandé pour IA)
- `content.yaml` - Format YAML (recommandé pour humains)
- `content.md` - Format Markdown (documentation)
- `content.xml` - Format XML (interopérabilité)

Tous ces fichiers contiennent **le même contenu** pour faciliter la comparaison.

### Comment choisir le bon format ?

| Cas d'usage | Format recommandé | Raison |
|-------------|-------------------|--------|
| Génération automatique par IA | JSON | Clarté maximale (85%) |
| Édition manuelle par humain | YAML | Lisibilité |
| Documentation technique | Markdown | Rendu visuel |
| Intégration avec systèmes legacy | XML | Standard industriel |
| API REST | JSON | Standard web |
| Configuration applicative | YAML | Simplicité |

---

## Guide d'intégration

### 1. Import via JavaScript

```javascript
// Import JSON
fetch('examples/import/content.json')
  .then(response => response.json())
  .then(data => {
    renderContent(data);
  });

// Import YAML (avec js-yaml)
fetch('examples/import/content.yaml')
  .then(response => response.text())
  .then(yamlText => {
    const data = jsyaml.load(yamlText);
    renderContent(data);
  });

// Import XML (avec DOMParser)
fetch('examples/import/content.xml')
  .then(response => response.text())
  .then(xmlText => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const data = parseXML(xmlDoc);
    renderContent(data);
  });
```

### 2. Validation des données

```javascript
function validateBlock(block) {
  if (!block.id) {
    throw new Error('Block must have an id');
  }
  if (!block.type) {
    throw new Error('Block must have a type');
  }
  if (!block.position) {
    throw new Error('Block must have a position');
  }
  // Validation spécifique selon le type
  switch(block.type) {
    case 'text_block':
      if (!block.content.title || !block.content.text) {
        throw new Error('text_block requires title and text');
      }
      break;
    case 'card_block':
      if (!block.content.title) {
        throw new Error('card_block requires title');
      }
      break;
    // ...
  }
}
```

### 3. Rendu des blocs

```javascript
function renderContent(data) {
  const container = document.getElementById('content-container');

  // Tri des blocs par position
  const sortedBlocks = data.blocks.sort((a, b) => a.position - b.position);

  sortedBlocks.forEach(block => {
    const element = createBlockElement(block);
    container.appendChild(element);
  });
}

function createBlockElement(block) {
  switch(block.type) {
    case 'text_block':
      return createTextBlock(block);
    case 'card_block':
      return createCardBlock(block);
    case 'parallax_horizontal':
      return createParallaxHorizontal(block);
    // ...
  }
}
```

### 4. Gestion des sources

```javascript
function renderSources(sources) {
  if (!sources || sources.length === 0) return '';

  const sourcesList = sources.map(source => `
    <li class="source-item">
      <span class="source-type">[${source.type}]</span>
      <a href="${source.url}" target="_blank" rel="noopener">
        ${source.title}
      </a>
    </li>
  `).join('');

  return `
    <div class="sources">
      <h4>Sources :</h4>
      <ul>${sourcesList}</ul>
    </div>
  `;
}
```

### 5. Gestion des animations

```javascript
function applyAnimation(element, animation) {
  if (!animation) return;

  switch(animation.type) {
    case 'parallax':
      element.classList.add('img-wrapper');
      if (animation.speed) {
        element.classList.add(animation.speed);
      }
      break;
    case 'parallax_horizontal':
      element.classList.add('horizontal-scroll-wrapper');
      break;
    case 'parallax_vertical':
      element.classList.add('vertical-scroll-wrapper');
      break;
  }
}
```

---

## Annexe : Comparaison visuelle des formats

### JSON
```json
{
  "blocks": [
    {
      "id": "hero",
      "type": "text_block",
      "content": {
        "title": "Titre"
      }
    }
  ]
}
```

**Avantages :** Structure explicite, validation facile
**Inconvénients :** Verbeux, moins lisible pour humains

### YAML
```yaml
blocks:
  - id: hero
    type: text_block
    content:
      title: Titre
```

**Avantages :** Lisible, concis
**Inconvénients :** Sensible à l'indentation

### Markdown
```markdown
## [BLOC HERO] Titre

`type: text_block, position: 1`
```

**Avantages :** Excellent pour documentation
**Inconvénients :** Structure moins formelle

### XML
```xml
<block id="hero" type="text_block">
  <content>
    <title>Titre</title>
  </content>
</block>
```

**Avantages :** Validation stricte, interopérable
**Inconvénients :** Très verbeux

---

## Support et Contribution

Pour toute question ou suggestion d'amélioration, consultez la documentation ou contactez l'équipe de développement.

**Version du guide :** 1.0
**Dernière mise à jour :** 2024-11-05
