// Configuration
const ADMIN_PASSWORD_HASH = 'c2bf6f1c3c218089e0f4ed85cdb86316ec2657fb548ea450c260ca8e4e45b041';

// Application State
let appState = {
  authenticated: false,
  currentSection: 'editor',
  siteData: {
    title: '',
    chapo: '',
    blocks: [],
    footer: {
      content: '© 2025 Mon Site',
      bgColor: '#000000'
    },
    settings: {
      defaultBgColor: '#000000',
      defaultFont: 'Inter'
    }
  },
  selectedBlockIndex: null
};

// Utility: SHA-256 Hash
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Authentication
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const password = document.getElementById('password').value;
  const hash = await sha256(password);

  if (hash === ADMIN_PASSWORD_HASH) {
    appState.authenticated = true;
    document.getElementById('login-page').classList.remove('active');
    document.getElementById('admin-page').classList.add('active');
    loadFromLocalStorage();
  } else {
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = 'Mot de passe incorrect';
    errorEl.classList.add('show');
  }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  appState.authenticated = false;
  document.getElementById('admin-page').classList.remove('active');
  document.getElementById('login-page').classList.add('active');
  document.getElementById('password').value = '';
});

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const section = item.dataset.section;

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');

    // Update sections
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`${section}-section`).classList.add('active');

    appState.currentSection = section;

    if (section === 'preview') {
      generatePreview();
    }
  });
});

// Site Data Management
document.getElementById('site-title').addEventListener('input', (e) => {
  appState.siteData.title = e.target.value;
  saveToLocalStorage();
});

document.getElementById('site-chapo').addEventListener('input', (e) => {
  appState.siteData.chapo = e.target.value;
  saveToLocalStorage();
});

document.getElementById('footer-content').addEventListener('input', (e) => {
  appState.siteData.footer.content = e.target.value;
  saveToLocalStorage();
});

document.getElementById('footer-bg-color').addEventListener('change', (e) => {
  appState.siteData.footer.bgColor = e.target.value;
  saveToLocalStorage();
});

// Block Management
document.querySelectorAll('.add-block-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const blockType = btn.dataset.type;
    addBlock(blockType);
  });
});

function addBlock(type) {
  const block = createBlockData(type);
  appState.siteData.blocks.push(block);
  renderBlocksList();
  saveToLocalStorage();
}

function createBlockData(type) {
  const baseBlock = {
    id: Date.now() + Math.random(),
    type: type
  };

  switch (type) {
    case 'parallax-vertical':
      return {
        ...baseBlock,
        title: 'Bloc Parallax Vertical',
        images: [
          { url: '', speed: 'normal', alt: '' }
        ]
      };

    case 'parallax-horizontal':
      return {
        ...baseBlock,
        title: 'Bloc Parallax Horizontal',
        images: [
          { url: '', speed: 'normal', alt: '', position: 0 }
        ]
      };

    case 'timeline':
      return {
        ...baseBlock,
        title: 'Frise Chronologique',
        items: [
          { year: '2024', title: '', description: '', image: '' }
        ]
      };

    case 'box':
      return {
        ...baseBlock,
        title: 'Bloc Encadré',
        content: '',
        bgColor: '#1e293b',
        borderColor: '#6366f1'
      };

    case 'popup':
      return {
        ...baseBlock,
        title: 'Popup Messages',
        messages: [
          { trigger: 'scroll', position: '50%', message: 'Message popup', duration: 3000 }
        ]
      };

    case 'text':
      return {
        ...baseBlock,
        title: 'Bloc Texte',
        content: '<p>Votre contenu ici...</p>',
        alignment: 'left'
      };

    default:
      return baseBlock;
  }
}

function renderBlocksList() {
  const blocksList = document.getElementById('blocks-list');

  if (appState.siteData.blocks.length === 0) {
    blocksList.innerHTML = '';
    blocksList.classList.add('empty');
    return;
  }

  blocksList.classList.remove('empty');
  blocksList.innerHTML = appState.siteData.blocks.map((block, index) => `
    <div class="block-item ${appState.selectedBlockIndex === index ? 'active' : ''}" data-index="${index}">
      <div class="block-item-header">
        <div class="block-item-title">
          <i class="${getBlockIcon(block.type)}"></i>
          <span>${block.title}</span>
        </div>
        <div class="block-item-actions">
          <button class="edit-btn" onclick="editBlock(${index})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="move-up-btn" onclick="moveBlock(${index}, -1)" ${index === 0 ? 'disabled' : ''}>
            <i class="fas fa-arrow-up"></i>
          </button>
          <button class="move-down-btn" onclick="moveBlock(${index}, 1)" ${index === appState.siteData.blocks.length - 1 ? 'disabled' : ''}>
            <i class="fas fa-arrow-down"></i>
          </button>
          <button class="delete-btn" onclick="deleteBlock(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function getBlockIcon(type) {
  const icons = {
    'parallax-vertical': 'fas fa-arrows-alt-v',
    'parallax-horizontal': 'fas fa-arrows-alt-h',
    'timeline': 'fas fa-stream',
    'box': 'fas fa-square',
    'popup': 'fas fa-comment',
    'text': 'fas fa-align-left'
  };
  return icons[type] || 'fas fa-cube';
}

function editBlock(index) {
  appState.selectedBlockIndex = index;
  const block = appState.siteData.blocks[index];
  renderBlockEditor(block);
  renderBlocksList();
}

function deleteBlock(index) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce bloc ?')) {
    appState.siteData.blocks.splice(index, 1);
    appState.selectedBlockIndex = null;
    renderBlocksList();
    clearBlockEditor();
    saveToLocalStorage();
  }
}

function moveBlock(index, direction) {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= appState.siteData.blocks.length) return;

  [appState.siteData.blocks[index], appState.siteData.blocks[newIndex]] =
  [appState.siteData.blocks[newIndex], appState.siteData.blocks[index]];

  if (appState.selectedBlockIndex === index) {
    appState.selectedBlockIndex = newIndex;
  }

  renderBlocksList();
  saveToLocalStorage();
}

function renderBlockEditor(block) {
  const editor = document.getElementById('block-editor');

  let html = `<h3>${block.title}</h3>`;

  switch (block.type) {
    case 'parallax-vertical':
    case 'parallax-horizontal':
      html += renderParallaxEditor(block);
      break;
    case 'timeline':
      html += renderTimelineEditor(block);
      break;
    case 'box':
      html += renderBoxEditor(block);
      break;
    case 'popup':
      html += renderPopupEditor(block);
      break;
    case 'text':
      html += renderTextEditor(block);
      break;
  }

  editor.innerHTML = html;
  attachBlockEditorEvents();
}

function renderParallaxEditor(block) {
  return `
    <div class="form-group">
      <label>Titre du bloc</label>
      <input type="text" class="form-control block-title" value="${block.title}">
    </div>
    <div id="images-list">
      ${block.images.map((img, i) => `
        <div class="form-group" style="padding: 1rem; background: var(--bg-dark); border-radius: 8px; margin-bottom: 1rem;">
          <label>Image ${i + 1}</label>
          <input type="text" class="form-control image-url" data-index="${i}" placeholder="URL de l'image" value="${img.url}">
          <div style="margin-top: 0.5rem;">
            <label>Vitesse</label>
            <select class="form-control image-speed" data-index="${i}">
              <option value="slower" ${img.speed === 'slower' ? 'selected' : ''}>Lent</option>
              <option value="normal" ${img.speed === 'normal' ? 'selected' : ''}>Normal</option>
              <option value="faster" ${img.speed === 'faster' ? 'selected' : ''}>Rapide</option>
            </select>
          </div>
          <button class="btn btn-danger btn-sm" style="margin-top: 0.5rem;" onclick="removeImage(${i})">
            <i class="fas fa-trash"></i> Supprimer
          </button>
        </div>
      `).join('')}
    </div>
    <button class="btn btn-primary btn-sm" onclick="addImage()">
      <i class="fas fa-plus"></i> Ajouter une image
    </button>
  `;
}

function renderTimelineEditor(block) {
  return `
    <div class="form-group">
      <label>Titre du bloc</label>
      <input type="text" class="form-control block-title" value="${block.title}">
    </div>
    <div id="timeline-items">
      ${block.items.map((item, i) => `
        <div class="form-group" style="padding: 1rem; background: var(--bg-dark); border-radius: 8px; margin-bottom: 1rem;">
          <label>Événement ${i + 1}</label>
          <input type="text" class="form-control timeline-year" data-index="${i}" placeholder="Année" value="${item.year}">
          <input type="text" class="form-control timeline-title" data-index="${i}" placeholder="Titre" value="${item.title}" style="margin-top: 0.5rem;">
          <textarea class="form-control timeline-desc" data-index="${i}" placeholder="Description" style="margin-top: 0.5rem;">${item.description}</textarea>
          <input type="text" class="form-control timeline-image" data-index="${i}" placeholder="URL de l'image" value="${item.image}" style="margin-top: 0.5rem;">
          <button class="btn btn-danger btn-sm" style="margin-top: 0.5rem;" onclick="removeTimelineItem(${i})">
            <i class="fas fa-trash"></i> Supprimer
          </button>
        </div>
      `).join('')}
    </div>
    <button class="btn btn-primary btn-sm" onclick="addTimelineItem()">
      <i class="fas fa-plus"></i> Ajouter un événement
    </button>
  `;
}

function renderBoxEditor(block) {
  return `
    <div class="form-group">
      <label>Titre du bloc</label>
      <input type="text" class="form-control block-title" value="${block.title}">
    </div>
    <div class="form-group">
      <label>Contenu</label>
      <textarea class="form-control block-content" rows="5">${block.content}</textarea>
    </div>
    <div class="form-group">
      <label>Couleur de fond</label>
      <input type="color" class="form-control block-bg-color" value="${block.bgColor}">
    </div>
    <div class="form-group">
      <label>Couleur de bordure</label>
      <input type="color" class="form-control block-border-color" value="${block.borderColor}">
    </div>
  `;
}

function renderPopupEditor(block) {
  return `
    <div class="form-group">
      <label>Titre du bloc</label>
      <input type="text" class="form-control block-title" value="${block.title}">
    </div>
    <div id="popup-messages">
      ${block.messages.map((msg, i) => `
        <div class="form-group" style="padding: 1rem; background: var(--bg-dark); border-radius: 8px; margin-bottom: 1rem;">
          <label>Message ${i + 1}</label>
          <input type="text" class="form-control popup-message" data-index="${i}" placeholder="Message" value="${msg.message}">
          <div style="margin-top: 0.5rem;">
            <label>Déclencheur</label>
            <select class="form-control popup-trigger" data-index="${i}">
              <option value="scroll" ${msg.trigger === 'scroll' ? 'selected' : ''}>Au scroll</option>
              <option value="time" ${msg.trigger === 'time' ? 'selected' : ''}>Temporisé</option>
              <option value="click" ${msg.trigger === 'click' ? 'selected' : ''}>Au clic</option>
            </select>
          </div>
          <input type="number" class="form-control popup-duration" data-index="${i}" placeholder="Durée (ms)" value="${msg.duration}" style="margin-top: 0.5rem;">
          <button class="btn btn-danger btn-sm" style="margin-top: 0.5rem;" onclick="removePopupMessage(${i})">
            <i class="fas fa-trash"></i> Supprimer
          </button>
        </div>
      `).join('')}
    </div>
    <button class="btn btn-primary btn-sm" onclick="addPopupMessage()">
      <i class="fas fa-plus"></i> Ajouter un message
    </button>
  `;
}

function renderTextEditor(block) {
  return `
    <div class="form-group">
      <label>Titre du bloc</label>
      <input type="text" class="form-control block-title" value="${block.title}">
    </div>
    <div class="form-group">
      <label>Contenu (HTML supporté)</label>
      <textarea class="form-control block-content" rows="10">${block.content}</textarea>
    </div>
    <div class="form-group">
      <label>Alignement</label>
      <select class="form-control block-alignment">
        <option value="left" ${block.alignment === 'left' ? 'selected' : ''}>Gauche</option>
        <option value="center" ${block.alignment === 'center' ? 'selected' : ''}>Centre</option>
        <option value="right" ${block.alignment === 'right' ? 'selected' : ''}>Droite</option>
      </select>
    </div>
  `;
}

function clearBlockEditor() {
  const editor = document.getElementById('block-editor');
  editor.innerHTML = `
    <div class="empty-state">
      <i class="fas fa-cube"></i>
      <p>Sélectionnez un bloc pour le modifier</p>
    </div>
  `;
}

function attachBlockEditorEvents() {
  const blockTitle = document.querySelector('.block-title');
  const blockContent = document.querySelector('.block-content');
  const blockBgColor = document.querySelector('.block-bg-color');
  const blockBorderColor = document.querySelector('.block-border-color');
  const blockAlignment = document.querySelector('.block-alignment');

  if (blockTitle) {
    blockTitle.addEventListener('input', (e) => {
      appState.siteData.blocks[appState.selectedBlockIndex].title = e.target.value;
      renderBlocksList();
      saveToLocalStorage();
    });
  }

  if (blockContent) {
    blockContent.addEventListener('input', (e) => {
      appState.siteData.blocks[appState.selectedBlockIndex].content = e.target.value;
      saveToLocalStorage();
    });
  }

  if (blockBgColor) {
    blockBgColor.addEventListener('change', (e) => {
      appState.siteData.blocks[appState.selectedBlockIndex].bgColor = e.target.value;
      saveToLocalStorage();
    });
  }

  if (blockBorderColor) {
    blockBorderColor.addEventListener('change', (e) => {
      appState.siteData.blocks[appState.selectedBlockIndex].borderColor = e.target.value;
      saveToLocalStorage();
    });
  }

  if (blockAlignment) {
    blockAlignment.addEventListener('change', (e) => {
      appState.siteData.blocks[appState.selectedBlockIndex].alignment = e.target.value;
      saveToLocalStorage();
    });
  }

  // Image editors
  document.querySelectorAll('.image-url').forEach(input => {
    input.addEventListener('input', (e) => {
      const index = parseInt(e.target.dataset.index);
      appState.siteData.blocks[appState.selectedBlockIndex].images[index].url = e.target.value;
      saveToLocalStorage();
    });
  });

  document.querySelectorAll('.image-speed').forEach(select => {
    select.addEventListener('change', (e) => {
      const index = parseInt(e.target.dataset.index);
      appState.siteData.blocks[appState.selectedBlockIndex].images[index].speed = e.target.value;
      saveToLocalStorage();
    });
  });

  // Timeline editors
  document.querySelectorAll('.timeline-year').forEach(input => {
    input.addEventListener('input', (e) => {
      const index = parseInt(e.target.dataset.index);
      appState.siteData.blocks[appState.selectedBlockIndex].items[index].year = e.target.value;
      saveToLocalStorage();
    });
  });

  document.querySelectorAll('.timeline-title').forEach(input => {
    input.addEventListener('input', (e) => {
      const index = parseInt(e.target.dataset.index);
      appState.siteData.blocks[appState.selectedBlockIndex].items[index].title = e.target.value;
      saveToLocalStorage();
    });
  });

  document.querySelectorAll('.timeline-desc').forEach(textarea => {
    textarea.addEventListener('input', (e) => {
      const index = parseInt(e.target.dataset.index);
      appState.siteData.blocks[appState.selectedBlockIndex].items[index].description = e.target.value;
      saveToLocalStorage();
    });
  });

  document.querySelectorAll('.timeline-image').forEach(input => {
    input.addEventListener('input', (e) => {
      const index = parseInt(e.target.dataset.index);
      appState.siteData.blocks[appState.selectedBlockIndex].items[index].image = e.target.value;
      saveToLocalStorage();
    });
  });

  // Popup editors
  document.querySelectorAll('.popup-message').forEach(input => {
    input.addEventListener('input', (e) => {
      const index = parseInt(e.target.dataset.index);
      appState.siteData.blocks[appState.selectedBlockIndex].messages[index].message = e.target.value;
      saveToLocalStorage();
    });
  });

  document.querySelectorAll('.popup-trigger').forEach(select => {
    select.addEventListener('change', (e) => {
      const index = parseInt(e.target.dataset.index);
      appState.siteData.blocks[appState.selectedBlockIndex].messages[index].trigger = e.target.value;
      saveToLocalStorage();
    });
  });

  document.querySelectorAll('.popup-duration').forEach(input => {
    input.addEventListener('input', (e) => {
      const index = parseInt(e.target.dataset.index);
      appState.siteData.blocks[appState.selectedBlockIndex].messages[index].duration = parseInt(e.target.value);
      saveToLocalStorage();
    });
  });
}

// Helper functions for adding/removing items
window.addImage = function() {
  const block = appState.siteData.blocks[appState.selectedBlockIndex];
  block.images.push({ url: '', speed: 'normal', alt: '' });
  renderBlockEditor(block);
  saveToLocalStorage();
};

window.removeImage = function(index) {
  const block = appState.siteData.blocks[appState.selectedBlockIndex];
  block.images.splice(index, 1);
  renderBlockEditor(block);
  saveToLocalStorage();
};

window.addTimelineItem = function() {
  const block = appState.siteData.blocks[appState.selectedBlockIndex];
  block.items.push({ year: '', title: '', description: '', image: '' });
  renderBlockEditor(block);
  saveToLocalStorage();
};

window.removeTimelineItem = function(index) {
  const block = appState.siteData.blocks[appState.selectedBlockIndex];
  block.items.splice(index, 1);
  renderBlockEditor(block);
  saveToLocalStorage();
};

window.addPopupMessage = function() {
  const block = appState.siteData.blocks[appState.selectedBlockIndex];
  block.messages.push({ trigger: 'scroll', position: '50%', message: '', duration: 3000 });
  renderBlockEditor(block);
  saveToLocalStorage();
};

window.removePopupMessage = function(index) {
  const block = appState.siteData.blocks[appState.selectedBlockIndex];
  block.messages.splice(index, 1);
  renderBlockEditor(block);
  saveToLocalStorage();
};

// Make functions globally available
window.editBlock = editBlock;
window.deleteBlock = deleteBlock;
window.moveBlock = moveBlock;

// Preview Generation
function generatePreview() {
  const html = generateSiteHTML();
  const iframe = document.getElementById('preview-frame');
  iframe.srcdoc = html;
}

document.getElementById('refresh-preview-btn').addEventListener('click', generatePreview);

// Save/Load Project
document.getElementById('save-project-btn').addEventListener('click', () => {
  saveToLocalStorage();
  alert('Projet enregistré avec succès !');
});

document.getElementById('load-project-btn').addEventListener('click', () => {
  loadFromLocalStorage();
  renderBlocksList();
  clearBlockEditor();
  alert('Projet chargé avec succès !');
});

function saveToLocalStorage() {
  localStorage.setItem('parallaxBuilderData', JSON.stringify(appState.siteData));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('parallaxBuilderData');
  if (saved) {
    appState.siteData = JSON.parse(saved);
    document.getElementById('site-title').value = appState.siteData.title;
    document.getElementById('site-chapo').value = appState.siteData.chapo;
    document.getElementById('footer-content').value = appState.siteData.footer.content;
    document.getElementById('footer-bg-color').value = appState.siteData.footer.bgColor;
    renderBlocksList();
  }
}

// Export Functions
document.getElementById('export-zip-btn').addEventListener('click', exportToZip);
document.getElementById('export-gitlab-btn').addEventListener('click', exportToGitLab);
document.getElementById('export-cloudflare-btn').addEventListener('click', exportToCloudflare);
document.getElementById('export-json-btn').addEventListener('click', exportToJSON);

function exportToJSON() {
  const dataStr = JSON.stringify(appState.siteData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'parallax-config.json';
  a.click();
}

document.getElementById('import-project').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        appState.siteData = JSON.parse(e.target.result);
        loadFromLocalStorage();
        alert('Projet importé avec succès !');
      } catch (error) {
        alert('Erreur lors de l\'importation du fichier');
      }
    };
    reader.readAsText(file);
  }
});

async function exportToZip() {
  try {
    // Show loading state
    const btn = document.getElementById('export-zip-btn');
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Génération...';
    btn.disabled = true;

    // Génération des fichiers
    const html = generateSiteHTML();
    const css = generateSiteCSS();
    const js = generateSiteJS();

    // Create ZIP file
    const zip = new JSZip();

    // Add files to ZIP
    zip.file('index.html', html);
    zip.file('style.css', css);
    zip.file('script.js', js);

    // Add a README
    const readme = `# ${appState.siteData.title || 'Mon Site Parallax'}

Ce site a été généré avec Parallax Builder.

## Installation

1. Extrayez ce fichier ZIP
2. Ouvrez index.html dans votre navigateur web
3. Pour héberger en ligne, uploadez tous les fichiers sur votre serveur web

## Structure

- index.html : Page principale du site
- style.css : Fichier de styles
- script.js : Scripts JavaScript pour les interactions

## Support

Pour toute question ou assistance, consultez la documentation du Parallax Builder.
`;
    zip.file('README.md', readme);

    // Generate ZIP file
    const content = await zip.generateAsync({ type: 'blob' });

    // Download ZIP
    saveAs(content, `${appState.siteData.title || 'parallax-site'}.zip`);

    // Reset button
    btn.innerHTML = originalContent;
    btn.disabled = false;

    alert('Site exporté avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    alert('Erreur lors de l\'export du site');
    document.getElementById('export-zip-btn').disabled = false;
  }
}

function exportToGitLab() {
  const gitlabUrl = document.getElementById('gitlab-url').value;
  const gitlabToken = document.getElementById('gitlab-token').value;

  if (!gitlabUrl || !gitlabToken) {
    alert('Veuillez renseigner l\'URL du dépôt et le token d\'accès');
    return;
  }

  alert('Export GitLab: Cette fonctionnalité nécessite un backend serveur pour interagir avec l\'API GitLab de manière sécurisée.');
}

function exportToCloudflare() {
  const accountId = document.getElementById('cloudflare-account').value;
  const token = document.getElementById('cloudflare-token').value;
  const project = document.getElementById('cloudflare-project').value;

  if (!accountId || !token || !project) {
    alert('Veuillez renseigner tous les champs Cloudflare');
    return;
  }

  alert('Export Cloudflare: Cette fonctionnalité nécessite un backend serveur pour interagir avec l\'API Cloudflare de manière sécurisée.');
}

// Site Generation
function generateSiteHTML() {
  const { title, chapo, blocks, footer } = appState.siteData;

  let blocksHTML = blocks.map(block => generateBlockHTML(block)).join('\n');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'Mon Site Parallax'}</title>
  <style>${generateSiteCSS()}</style>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href='https://fonts.googleapis.com/css?family=Merriweather:700' rel='stylesheet'>
  <link href='https://fonts.googleapis.com/css?family=Raleway' rel='stylesheet'>
</head>
<body>
  <div class="site-container">
    ${title || chapo ? `
    <header class="site-header">
      ${title ? `<h1 class="site-title">${title}</h1>` : ''}
      ${chapo ? `<p class="site-chapo">${chapo}</p>` : ''}
    </header>
    ` : ''}

    <main class="site-main">
      ${blocksHTML}
    </main>

    <footer class="site-footer" style="background-color: ${footer.bgColor}">
      ${footer.content}
    </footer>
  </div>
  <script>${generateSiteJS()}</script>
</body>
</html>`;
}

function generateBlockHTML(block) {
  switch (block.type) {
    case 'parallax-horizontal':
      return generateParallaxHorizontalHTML(block);
    case 'parallax-vertical':
      return generateParallaxVerticalHTML(block);
    case 'timeline':
      return generateTimelineHTML(block);
    case 'box':
      return generateBoxHTML(block);
    case 'popup':
      return generatePopupHTML(block);
    case 'text':
      return generateTextHTML(block);
    default:
      return '';
  }
}

function generateParallaxHorizontalHTML(block) {
  return `
  <section class="parallax-horizontal-section">
    <div class="external">
      <div class="horizontal-scroll-wrapper">
        ${block.images.map(img => `
          <div class="img-wrapper ${img.speed}">
            <img src="${img.url}" alt="${img.alt || ''}">
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

function generateParallaxVerticalHTML(block) {
  return `
  <section class="parallax-vertical-section">
    ${block.images.map(img => `
      <div class="parallax-layer ${img.speed}">
        <img src="${img.url}" alt="${img.alt || ''}">
      </div>
    `).join('')}
  </section>
  `;
}

function generateTimelineHTML(block) {
  return `
  <section class="timeline-section">
    <div class="timeline-container">
      ${block.items.map(item => `
        <div class="timeline-item">
          <div class="timeline-year">${item.year}</div>
          <div class="timeline-content">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  </section>
  `;
}

function generateBoxHTML(block) {
  return `
  <section class="box-section" style="background-color: ${block.bgColor}; border: 2px solid ${block.borderColor}">
    <div class="box-content">
      ${block.content}
    </div>
  </section>
  `;
}

function generatePopupHTML(block) {
  return `
  <div class="popup-container" data-messages='${JSON.stringify(block.messages)}'>
    <!-- Popups will be handled by JavaScript -->
  </div>
  `;
}

function generateTextHTML(block) {
  return `
  <section class="text-section" style="text-align: ${block.alignment}">
    <div class="text-content">
      ${block.content}
    </div>
  </section>
  `;
}

function generateSiteCSS() {
  return `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: #000;
  color: #fff;
  overflow-x: hidden;
}

.site-container {
  width: 100%;
}

.site-header {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.site-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.site-chapo {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 800px;
  margin: 0 auto;
}

.site-main {
  min-height: 60vh;
}

/* Parallax Horizontal */
.parallax-horizontal-section {
  height: 100vh;
  overflow: hidden;
}

.external {
  overflow: hidden;
  height: 100vh;
}

.horizontal-scroll-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vh;
  transform: rotate(-90deg) translate3d(0, -100vh, 0);
  transform-origin: right top;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
  height: 100vw;
  perspective: 1px;
  transform-style: preserve-3d;
  padding-bottom: 10rem;
}

.img-wrapper {
  transform: rotate(90deg);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  transform-origin: 50% 50%;
  transition: 1s;
}

.img-wrapper img {
  max-width: 45vh;
  max-height: 50vh;
  border-radius: 15px;
  box-shadow: 0px 12px 50px rgba(0, 0, 0, 0.5);
}

.img-wrapper.slower {
  transform: rotate(90deg) translateZ(-.2px) scale(1.1);
}

.img-wrapper.faster {
  transform: rotate(90deg) translateZ(.15px) scale(0.8);
}

/* Parallax Vertical */
.parallax-vertical-section {
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.parallax-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.parallax-layer img {
  max-width: 80%;
  max-height: 80%;
  border-radius: 15px;
}

/* Timeline */
.timeline-section {
  padding: 4rem 2rem;
  overflow-x: auto;
}

.timeline-container {
  display: flex;
  gap: 3rem;
  padding: 2rem;
  min-width: max-content;
}

.timeline-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 12px;
  min-width: 300px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.timeline-year {
  font-size: 2rem;
  font-weight: 700;
  color: #6366f1;
  margin-bottom: 1rem;
}

.timeline-content h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.timeline-content img {
  width: 100%;
  border-radius: 8px;
  margin-top: 1rem;
}

/* Box Section */
.box-section {
  padding: 3rem 2rem;
  margin: 2rem auto;
  max-width: 1200px;
  border-radius: 12px;
}

.box-content {
  font-size: 1.125rem;
  line-height: 1.8;
}

/* Text Section */
.text-section {
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.text-content {
  font-size: 1.125rem;
  line-height: 1.8;
}

/* Footer */
.site-footer {
  padding: 3rem 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
}

/* Popup */
.popup-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(99, 102, 241, 0.95);
  color: white;
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  z-index: 9999;
  animation: popupFadeIn 0.3s ease;
}

@keyframes popupFadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #000;
}

::-webkit-scrollbar-thumb {
  background: #6366f1;
  border-radius: 4px;
}
  `;
}

function generateSiteJS() {
  return `
// Popup Messages
document.querySelectorAll('.popup-container').forEach(container => {
  const messages = JSON.parse(container.dataset.messages || '[]');

  messages.forEach(msg => {
    if (msg.trigger === 'scroll') {
      let shown = false;
      window.addEventListener('scroll', () => {
        if (!shown && window.scrollY > window.innerHeight * 0.5) {
          showPopup(msg.message, msg.duration);
          shown = true;
        }
      });
    } else if (msg.trigger === 'time') {
      setTimeout(() => {
        showPopup(msg.message, msg.duration);
      }, 2000);
    }
  });
});

function showPopup(message, duration) {
  const popup = document.createElement('div');
  popup.className = 'popup-message';
  popup.textContent = message;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.style.animation = 'popupFadeIn 0.3s ease reverse';
    setTimeout(() => popup.remove(), 300);
  }, duration);
}

// Parallax effects
window.addEventListener('scroll', () => {
  document.querySelectorAll('.parallax-layer').forEach((layer, index) => {
    const speed = layer.classList.contains('slower') ? 0.5 : layer.classList.contains('faster') ? 1.5 : 1;
    const yPos = -(window.scrollY * speed * 0.5);
    layer.style.transform = \`translateY(\${yPos}px)\`;
  });
});
  `;
}

// Templates Management
document.getElementById('load-template-btn').addEventListener('click', async () => {
  const modal = document.getElementById('templates-modal');
  const templatesList = document.getElementById('templates-list');

  try {
    // Load templates from file
    const response = await fetch('templates-examples.json');
    const data = await response.json();

    templatesList.innerHTML = data.templates.map((template, index) => `
      <div class="template-card" data-index="${index}">
        <h4>${template.name}</h4>
        <p>${template.description}</p>
        <button class="btn btn-primary btn-sm load-template-btn" data-index="${index}">
          <i class="fas fa-download"></i> Utiliser ce template
        </button>
      </div>
    `).join('');

    // Add event listeners
    document.querySelectorAll('.load-template-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        loadTemplate(data.templates[index]);
        modal.classList.remove('active');
      });
    });

    modal.classList.add('active');
  } catch (error) {
    console.error('Erreur lors du chargement des templates:', error);
    alert('Impossible de charger les templates. Vérifiez que le fichier templates-examples.json existe.');
  }
});

document.querySelector('.modal-close-templates').addEventListener('click', () => {
  document.getElementById('templates-modal').classList.remove('active');
});

function loadTemplate(template) {
  if (confirm('Charger ce template remplacera votre travail actuel. Continuer ?')) {
    appState.siteData = JSON.parse(JSON.stringify(template.data));
    document.getElementById('site-title').value = appState.siteData.title;
    document.getElementById('site-chapo').value = appState.siteData.chapo;
    document.getElementById('footer-content').value = appState.siteData.footer.content;
    document.getElementById('footer-bg-color').value = appState.siteData.footer.bgColor;
    renderBlocksList();
    clearBlockEditor();
    saveToLocalStorage();
    alert(`Template "${template.name}" chargé avec succès !`);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
});
