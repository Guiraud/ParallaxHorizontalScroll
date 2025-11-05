# Parallax Builder - Interface d'Administration

Interface d'administration complète pour créer des sites web avec des effets parallax horizontaux et verticaux.

## 🔐 Authentification

L'interface d'administration est protégée par un hash SHA-256.

- **Hash d'authentification**: `c2bf6f1c3c218089e0f4ed85cdb86316ec2657fb548ea450c260ca8e4e45b041`

Pour vous connecter, entrez le mot de passe correspondant à ce hash.

## 🚀 Démarrage Rapide

1. Ouvrez `admin.html` dans votre navigateur web
2. Connectez-vous avec le mot de passe
3. Commencez à construire votre site !

## 📋 Fonctionnalités

### 1. Éditeur de Site

L'éditeur vous permet de construire votre site de manière visuelle et intuitive :

#### En-tête du Site
- **Titre principal** : Le titre principal de votre site
- **Chapô** : Un sous-titre ou description courte

#### Types de Blocs Disponibles

##### 🔹 Bloc Parallax Vertical
Effet parallax avec défilement vertical classique.
- Ajoutez plusieurs images
- Configurez la vitesse de défilement (lent, normal, rapide)
- Personnalisez la position de chaque image

##### 🔸 Bloc Parallax Horizontal
Effet parallax avec défilement horizontal unique.
- Images qui défilent horizontalement
- Vitesses de parallax personnalisables
- Parfait pour des galeries immersives

##### 📅 Frise Chronologique Horizontale
Créez une timeline horizontale interactive.
- Ajoutez des événements avec année, titre, description
- Intégrez des images pour chaque événement
- Défilement horizontal fluide

##### 📦 Bloc Encadré
Bloc de contenu avec bordure personnalisable.
- Contenu texte libre
- Couleurs de fond et de bordure personnalisables
- Idéal pour mettre en avant des informations importantes

##### 💬 Bloc Popup de Messages
Messages qui apparaissent selon différents déclencheurs.
- Déclenchement au scroll
- Déclenchement temporisé
- Déclenchement au clic
- Durée d'affichage personnalisable

##### 📝 Bloc Texte
Bloc de texte simple avec support HTML.
- Contenu HTML supporté
- Alignement configurable (gauche, centre, droite)
- Parfait pour le contenu éditorial

#### Bas de Page
- Contenu personnalisable
- Couleur de fond configurable

### 2. Prévisualisation

- Visualisez votre site en temps réel
- Bouton d'actualisation pour voir les modifications
- Rendu dans un iframe isolé

### 3. Export

#### 📦 Export ZIP
Téléchargez votre site complet en un fichier ZIP :
- `index.html` : Page principale
- `style.css` : Feuille de styles
- `script.js` : Scripts JavaScript
- `README.md` : Documentation

**Utilisation** : Cliquez sur "Télécharger ZIP" et le fichier sera automatiquement généré et téléchargé.

#### 🦊 Export GitLab
Publiez votre site directement sur un dépôt GitLab.
- Entrez l'URL de votre dépôt GitLab
- Fournissez un token d'accès
- Cliquez sur "Publier sur GitLab"

**Note** : Cette fonctionnalité nécessite un backend serveur pour des raisons de sécurité.

#### ☁️ Export Cloudflare
Déployez votre site avec Cloudflare Workers.
- Account ID Cloudflare
- API Token
- Nom du projet
- Cliquez sur "Déployer sur Cloudflare"

**Note** : Cette fonctionnalité nécessite un backend serveur pour des raisons de sécurité.

### 4. Paramètres

#### Paramètres Généraux
- Couleur de fond par défaut
- Police par défaut (Inter, Raleway, Merriweather, Roboto)

#### Gestion des Données
- **Enregistrer** : Sauvegarde automatique dans le localStorage du navigateur
- **Charger** : Restaure la dernière version sauvegardée
- **Exporter JSON** : Télécharge la configuration complète en JSON
- **Importer JSON** : Charge une configuration depuis un fichier JSON

## 🎨 Guide d'Utilisation

### Créer votre Premier Site

1. **Connexion**
   - Ouvrez `admin.html`
   - Entrez votre mot de passe
   - Cliquez sur "Se connecter"

2. **Configuration de Base**
   - Renseignez le titre de votre site
   - Ajoutez un chapô descriptif

3. **Ajouter des Blocs**
   - Cliquez sur le type de bloc souhaité
   - Le bloc apparaît dans la liste
   - Cliquez sur l'icône d'édition (crayon) pour configurer le bloc

4. **Configurer un Bloc**
   - Remplissez les champs selon le type de bloc
   - Les modifications sont sauvegardées automatiquement
   - Utilisez les flèches pour réorganiser l'ordre des blocs

5. **Prévisualiser**
   - Cliquez sur "Prévisualisation" dans le menu latéral
   - Vérifiez le rendu de votre site
   - Revenez à l'éditeur pour ajuster

6. **Exporter**
   - Allez dans la section "Export"
   - Choisissez votre méthode d'export préférée
   - Suivez les instructions pour chaque type d'export

### Gestion des Blocs

- **Éditer** : Cliquez sur l'icône crayon
- **Déplacer vers le haut** : Cliquez sur la flèche haut
- **Déplacer vers le bas** : Cliquez sur la flèche bas
- **Supprimer** : Cliquez sur l'icône poubelle (confirmation demandée)

### Sauvegarde et Récupération

Votre travail est automatiquement sauvegardé dans le navigateur. Pour une sauvegarde permanente :

1. Allez dans "Paramètres"
2. Cliquez sur "Exporter la configuration (JSON)"
3. Conservez le fichier JSON en lieu sûr
4. Pour restaurer : utilisez "Importer un projet"

## 🔧 Structure Technique

### Fichiers Principaux

```
ParallaxHorizontalScroll/
├── admin.html              # Interface d'administration
├── admin-style.css         # Styles de l'interface admin
├── admin-script.js         # Logique JavaScript de l'admin
├── index.html              # Site de démonstration original
├── style.css               # Styles du site de démo
└── README.md               # Ce fichier
```

### Technologies Utilisées

- **HTML5** : Structure de l'interface
- **CSS3** : Styles et animations (CSS Grid, Flexbox, Variables CSS)
- **JavaScript (ES6+)** : Logique applicative
- **JSZip** : Génération de fichiers ZIP
- **FileSaver.js** : Téléchargement de fichiers
- **Font Awesome** : Icônes
- **Google Fonts** : Typographies (Inter, Raleway, Merriweather)

### API de Chiffrement

L'authentification utilise l'API Web Crypto pour le hachage SHA-256 :

```javascript
const hash = await crypto.subtle.digest('SHA-256', messageBuffer);
```

## 🔒 Sécurité

- **Authentification** : Hash SHA-256 stocké côté client
- **Sauvegarde** : localStorage du navigateur (limité au domaine)
- **Export** : Génération côté client (pas de transmission de données)

**Attention** : Pour une utilisation en production, il est recommandé de :
- Implémenter une authentification serveur
- Utiliser HTTPS
- Ajouter une gestion de sessions
- Mettre en place des tokens d'API pour les exports externes

## 🌐 Déploiement

### Option 1 : Serveur Web Simple

```bash
# Avec Python
python -m http.server 8000

# Avec Node.js (http-server)
npx http-server -p 8000
```

Puis ouvrez `http://localhost:8000/admin.html`

### Option 2 : Hébergement

Uploadez simplement les fichiers sur votre serveur web :
- Aucune dépendance serveur requise
- Fonctionne avec n'importe quel hébergeur statique
- Compatible avec GitHub Pages, Netlify, Vercel, etc.

## 📝 Exemple de Configuration JSON

```json
{
  "title": "Mon Portfolio Parallax",
  "chapo": "Découvrez mon travail à travers une expérience immersive",
  "blocks": [
    {
      "id": 1234567890,
      "type": "parallax-horizontal",
      "title": "Galerie de Projets",
      "images": [
        {
          "url": "https://example.com/image1.jpg",
          "speed": "slower",
          "alt": "Projet 1"
        }
      ]
    }
  ],
  "footer": {
    "content": "© 2025 Mon Portfolio",
    "bgColor": "#000000"
  }
}
```

## 🐛 Résolution de Problèmes

### La prévisualisation ne s'affiche pas
- Cliquez sur le bouton "Actualiser"
- Vérifiez que vous avez ajouté au moins un bloc
- Vérifiez la console du navigateur pour les erreurs

### L'export ZIP ne fonctionne pas
- Vérifiez que JSZip et FileSaver.js sont bien chargés
- Consultez la console pour les erreurs
- Essayez avec un navigateur récent (Chrome, Firefox, Edge)

### Mes modifications ne sont pas sauvegardées
- Vérifiez que le localStorage est activé dans votre navigateur
- Utilisez "Exporter JSON" pour une sauvegarde manuelle
- Certains navigateurs en mode privé ne persistent pas le localStorage

### Les images ne s'affichent pas
- Vérifiez que les URLs des images sont accessibles
- Testez les URLs directement dans le navigateur
- Vérifiez les CORS si les images viennent d'un autre domaine

## 🎯 Roadmap

Fonctionnalités à venir :
- [ ] Drag & drop pour réorganiser les blocs
- [ ] Bibliothèque d'images intégrée
- [ ] Templates prédéfinis
- [ ] Mode sombre pour l'interface admin
- [ ] Export vers GitHub Pages
- [ ] Backup automatique vers le cloud
- [ ] Collaboration en temps réel
- [ ] Historique des versions (undo/redo)

## 📄 Licence

Ce projet est fourni tel quel, sans garantie. Libre d'utilisation et de modification.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer des améliorations
- Soumettre des pull requests

## 📞 Support

Pour toute question ou assistance :
- Consultez ce README
- Vérifiez la console du navigateur pour les erreurs
- Testez avec un navigateur récent et à jour

---

**Version** : 1.0.0
**Dernière mise à jour** : 2025

Bon build ! 🚀
