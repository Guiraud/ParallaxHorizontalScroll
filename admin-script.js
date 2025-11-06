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
  renderBlockPreview(block);
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

  const preview = document.getElementById('block-preview');
  preview.innerHTML = `
    <div class="empty-state">
      <i class="fas fa-eye"></i>
      <p>La prévisualisation apparaîtra ici</p>
    </div>
  `;
}

// Render block preview
function renderBlockPreview(block) {
  const preview = document.getElementById('block-preview');
  let previewHTML = '';

  switch(block.type) {
    case 'text':
      previewHTML = `
        <div class="block-preview-content">
          <h3 style="color: #6366f1; margin-bottom: 1rem;">${block.title}</h3>
          ${block.content || '<p>Aucun contenu</p>'}
        </div>
      `;
      break;

    case 'parallax-horizontal':
      previewHTML = `
        <div class="block-preview-content">
          <h3 style="color: #6366f1; margin-bottom: 1rem;">${block.title}</h3>
          <div style="display: flex; gap: 1rem; overflow-x: auto; padding: 1rem 0;">
            ${block.images.map(img => `
              <div style="flex: 0 0 auto;">
                <img src="${img.url}" alt="${img.alt}" style="width: 200px; height: 150px; object-fit: cover; border-radius: 8px;">
                <p style="font-size: 0.8rem; margin-top: 0.5rem;">${img.alt}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      break;

    case 'box':
      previewHTML = `
        <div class="block-preview-content" style="background: ${block.bgColor || '#f0f0f0'}; border: 2px solid ${block.borderColor || '#333'};">
          <h3 style="color: #6366f1; margin-bottom: 1rem;">${block.title}</h3>
          ${block.content || '<p>Aucun contenu</p>'}
        </div>
      `;
      break;

    case 'timeline':
      previewHTML = `
        <div class="block-preview-content">
          <h3 style="color: #6366f1; margin-bottom: 1rem;">${block.title}</h3>
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            ${block.items.map(item => `
              <div style="display: flex; gap: 1rem; border-left: 3px solid #6366f1; padding-left: 1rem;">
                <div style="flex: 0 0 100px; font-weight: bold; color: #6366f1;">${item.year}</div>
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 0.5rem 0;">${item.title}</h4>
                  <p style="margin: 0; color: #666;">${item.description}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      break;

    case 'popup':
      previewHTML = `
        <div class="block-preview-content">
          <h3 style="color: #6366f1; margin-bottom: 1rem;">${block.title}</h3>
          <div style="display: grid; gap: 1rem;">
            ${block.messages.map(msg => `
              <div style="padding: 1rem; background: #f0f0f0; border-radius: 8px; border-left: 4px solid #6366f1;">
                <strong>${msg.title}</strong>
                <p style="margin: 0.5rem 0 0 0;">${msg.content}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      break;

    default:
      previewHTML = `
        <div class="block-preview-content">
          <h3 style="color: #6366f1; margin-bottom: 1rem;">${block.title}</h3>
          <p>Type de bloc: ${block.type}</p>
        </div>
      `;
  }

  preview.innerHTML = previewHTML;
}

// Tab navigation
document.addEventListener('click', (e) => {
  if (e.target.closest('.tab-btn')) {
    const btn = e.target.closest('.tab-btn');
    const tab = btn.dataset.tab;

    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update active content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.querySelector(`[data-content="${tab}"]`).classList.add('active');
  }
});

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
      renderBlockPreview(appState.siteData.blocks[appState.selectedBlockIndex]);
      saveToLocalStorage();
    });
  }

  if (blockContent) {
    blockContent.addEventListener('input', (e) => {
      appState.siteData.blocks[appState.selectedBlockIndex].content = e.target.value;
      renderBlockPreview(appState.siteData.blocks[appState.selectedBlockIndex]);
      saveToLocalStorage();
    });
  }

  if (blockBgColor) {
    blockBgColor.addEventListener('change', (e) => {
      appState.siteData.blocks[appState.selectedBlockIndex].bgColor = e.target.value;
      renderBlockPreview(appState.siteData.blocks[appState.selectedBlockIndex]);
      saveToLocalStorage();
    });
  }

  if (blockBorderColor) {
    blockBorderColor.addEventListener('change', (e) => {
      appState.siteData.blocks[appState.selectedBlockIndex].borderColor = e.target.value;
      renderBlockPreview(appState.siteData.blocks[appState.selectedBlockIndex]);
      saveToLocalStorage();
    });
  }

  if (blockAlignment) {
    blockAlignment.addEventListener('change', (e) => {
      appState.siteData.blocks[appState.selectedBlockIndex].alignment = e.target.value;
      renderBlockPreview(appState.siteData.blocks[appState.selectedBlockIndex]);
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

// ============================================
// THEMES EDITOR
// ============================================

let currentTheme = null;
let currentThemeName = '';
let themeSourceFormat = null; // Store original theme structure

// Load theme buttons
document.querySelectorAll('.theme-load-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const themeName = btn.dataset.theme;
    await loadTheme(themeName);
  });
});

// Convert theme JSON to builder blocks
function convertThemeToBlocks(themeData) {
  const blocks = [];
  let blockId = 1;

  // Helper to create block
  const createBlock = (type, title, data) => {
    return { id: blockId++, type, title, ...data };
  };

  // Analyze theme structure and convert
  if (themeData.introduction) {
    blocks.push(createBlock('text', 'Introduction', {
      content: `<h2>${themeData.introduction.title || 'Introduction'}</h2><p>${themeData.introduction.content || ''}</p>`,
      alignment: 'left'
    }));

    // Add statistics if available
    if (themeData.introduction.statistics) {
      let statsHTML = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">';
      Object.entries(themeData.introduction.statistics).forEach(([key, value]) => {
        statsHTML += `<div style="padding: 1rem; background: rgba(99, 102, 241, 0.1); border-radius: 8px;"><strong>${key}:</strong> ${value}</div>`;
      });
      statsHTML += '</div>';
      blocks.push(createBlock('text', 'Statistiques', {
        content: statsHTML,
        alignment: 'center'
      }));
    }
  }

  // Convert publicCibles/audiences
  if (themeData.publicCibles && themeData.publicCibles.audiences) {
    let audiencesHTML = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">';
    themeData.publicCibles.audiences.forEach(audience => {
      audiencesHTML += `
        <div style="padding: 1.5rem; background: rgba(30, 41, 59, 0.5); border-radius: 12px; border: 1px solid rgba(99, 102, 241, 0.3);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">${audience.icon || '👥'}</div>
          <h3 style="margin-bottom: 0.5rem;">${audience.name}</h3>
          <p style="color: #cbd5e1;">${audience.message || ''}</p>
        </div>
      `;
    });
    audiencesHTML += '</div>';
    blocks.push(createBlock('text', 'Publics Cibles', {
      content: audiencesHTML,
      alignment: 'center'
    }));
  }

  // Convert arguments
  if (themeData.arguments && themeData.arguments.items) {
    let argsHTML = '<div style="display: grid; gap: 1rem;">';
    themeData.arguments.items.forEach(arg => {
      argsHTML += `
        <div style="padding: 1.5rem; background: rgba(30, 41, 59, 0.5); border-radius: 12px; border-left: 4px solid #6366f1;">
          <h4 style="margin-bottom: 0.5rem;">${arg.id}. ${arg.title}</h4>
          <p style="color: #cbd5e1; margin-bottom: 0.5rem;">${arg.impact || ''}</p>
          ${arg.statUS ? `<p style="font-size: 0.9rem;">🇺🇸 ${arg.statUS}</p>` : ''}
          ${arg.statFrance ? `<p style="font-size: 0.9rem;">🇫🇷 ${arg.statFrance}</p>` : ''}
        </div>
      `;
    });
    argsHTML += '</div>';
    blocks.push(createBlock('text', 'Arguments', {
      content: argsHTML,
      alignment: 'left'
    }));
  }

  // Convert phrases discriminantes
  if (themeData.phrasesDiscriminantes && themeData.phrasesDiscriminantes.items) {
    let phrasesHTML = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">';
    themeData.phrasesDiscriminantes.items.forEach(phrase => {
      phrasesHTML += `
        <div style="padding: 1.5rem; background: rgba(239, 68, 68, 0.1); border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.3);">
          <p style="font-style: italic; margin-bottom: 1rem;">"${phrase.phrase}"</p>
          <p style="color: #10b981; font-weight: 600;">✓ ${phrase.dementi}</p>
        </div>
      `;
    });
    phrasesHTML += '</div>';
    blocks.push(createBlock('text', 'Phrases Discriminantes', {
      content: phrasesHTML,
      alignment: 'left'
    }));
  }

  // Convert arguments positifs
  if (themeData.argumentsPositifs && themeData.argumentsPositifs.items) {
    let posHTML = '<div style="display: grid; gap: 1rem;">';
    themeData.argumentsPositifs.items.forEach(item => {
      posHTML += `
        <div style="padding: 1.5rem; background: rgba(16, 185, 129, 0.1); border-radius: 12px;">
          <h4 style="margin-bottom: 0.5rem;">${item.title}</h4>
          <p style="color: #cbd5e1;">${item.description || ''}</p>
          ${item.impact ? `<p style="color: #10b981; margin-top: 0.5rem;">✨ ${item.impact}</p>` : ''}
        </div>
      `;
    });
    posHTML += '</div>';
    blocks.push(createBlock('text', 'Arguments Positifs', {
      content: posHTML,
      alignment: 'left'
    }));
  }

  // Convert campagnes
  if (themeData.campagnesEfficaces && themeData.campagnesEfficaces.items) {
    const timelineItems = themeData.campagnesEfficaces.items.map(camp => ({
      year: camp.period || '',
      title: camp.name || '',
      description: `${camp.description || ''}\n\n${camp.impact ? '📊 Impact: ' + camp.impact : ''}`,
      image: ''
    }));
    blocks.push(createBlock('timeline', 'Campagnes Efficaces', {
      items: timelineItems
    }));
  }

  // Convert ressources
  if (themeData.ressources) {
    let ressHTML = '';

    if (themeData.ressources.associations) {
      ressHTML += '<h3>Associations</h3><ul>';
      themeData.ressources.associations.forEach(asso => {
        ressHTML += `<li><strong>${asso.name}</strong> - ${asso.action || ''}</li>`;
      });
      ressHTML += '</ul>';
    }

    if (themeData.ressources.guides) {
      ressHTML += '<h3>Guides</h3><ul>';
      themeData.ressources.guides.forEach(guide => {
        ressHTML += `<li><strong>${guide.titre}</strong> - ${guide.description || ''}</li>`;
      });
      ressHTML += '</ul>';
    }

    if (ressHTML) {
      blocks.push(createBlock('text', 'Ressources', {
        content: ressHTML,
        alignment: 'left'
      }));
    }
  }

  // Convert call to action
  if (themeData.callToAction && themeData.callToAction.actions) {
    let ctaHTML = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">';
    themeData.callToAction.actions.forEach(action => {
      ctaHTML += `
        <div style="padding: 2rem; text-align: center; background: rgba(99, 102, 241, 0.1); border-radius: 12px; border: 2px solid #6366f1;">
          <h3 style="margin-bottom: 0.5rem;">${action.titre}</h3>
          <p style="color: #cbd5e1;">${action.description || ''}</p>
          ${action.url ? `<a href="${action.url}" style="color: #6366f1;">En savoir plus →</a>` : ''}
        </div>
      `;
    });
    ctaHTML += '</div>';
    blocks.push(createBlock('text', 'Appel à l\'action', {
      content: ctaHTML,
      alignment: 'center'
    }));
  }

  return {
    title: themeData.meta?.title || 'Mon Site',
    chapo: themeData.meta?.subtitle || '',
    blocks: blocks,
    footer: {
      content: themeData.footer?.message || '© 2025',
      bgColor: '#000000'
    }
  };
}

// Load theme from JSON file
async function loadTheme(themeName) {
  try {
    const response = await fetch(`/${themeName}.json`);
    if (!response.ok) {
      throw new Error(`Thème "${themeName}" non trouvé`);
    }
    currentTheme = await response.json();
    themeSourceFormat = JSON.parse(JSON.stringify(currentTheme)); // Deep copy
    currentThemeName = themeName;
    displayThemeEditor();
  } catch (error) {
    alert(`Erreur: ${error.message}`);
  }
}

// Display theme editor
function displayThemeEditor() {
  const container = document.getElementById('theme-editor-container');
  container.innerHTML = `
    <div class="theme-field-group">
      <h4><i class="fas fa-info-circle"></i> Mode d'édition</h4>
      <p style="color: var(--text-secondary); margin-bottom: 1rem;">
        Modifiez directement le JSON ci-dessous. Le format est validé automatiquement.
      </p>
    </div>
    <textarea id="theme-json-editor" spellcheck="false">${JSON.stringify(currentTheme, null, 2)}</textarea>
  `;
}

// Upload theme JSON
document.getElementById('upload-theme-json').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        currentTheme = JSON.parse(e.target.result);
        currentThemeName = file.name.replace('.json', '');
        displayThemeEditor();
      } catch (error) {
        alert('Erreur lors de la lecture du fichier JSON');
      }
    };
    reader.readAsText(file);
  }
});

// Download theme JSON
document.getElementById('download-theme-btn').addEventListener('click', () => {
  if (!currentTheme) {
    alert('Aucun thème chargé');
    return;
  }

  try {
    // Get edited JSON from textarea
    const editor = document.getElementById('theme-json-editor');
    if (editor) {
      currentTheme = JSON.parse(editor.value);
    }

    const dataStr = JSON.stringify(currentTheme, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentThemeName}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert('Thème téléchargé avec succès !');
  } catch (error) {
    alert('Erreur dans le JSON. Veuillez vérifier le format.');
  }
});

// Open theme in builder
document.getElementById('open-in-builder-btn').addEventListener('click', () => {
  if (!currentTheme) {
    alert('Aucun thème chargé');
    return;
  }

  try {
    // Get edited JSON from textarea
    const editor = document.getElementById('theme-json-editor');
    if (editor) {
      currentTheme = JSON.parse(editor.value);
      themeSourceFormat = JSON.parse(JSON.stringify(currentTheme)); // Update source
    }

    // Convert theme to builder format
    const builderData = convertThemeToBlocks(currentTheme);

    // Load into builder
    appState.siteData = builderData;
    document.getElementById('site-title').value = builderData.title;
    document.getElementById('site-chapo').value = builderData.chapo;
    document.getElementById('footer-content').value = builderData.footer.content;
    document.getElementById('footer-bg-color').value = builderData.footer.bgColor;

    // Render blocks
    renderBlocksList();
    clearBlockEditor();

    // Switch to builder section
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelector('[data-section="editor"]').classList.add('active');
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById('editor-section').classList.add('active');

    // Save to localStorage
    saveToLocalStorage();

    alert(`Thème "${currentThemeName}" converti et ouvert dans le builder !`);
  } catch (error) {
    console.error(error);
    alert('Erreur lors de la conversion du thème. Vérifiez le format JSON.');
  }
});

// Preview theme
document.getElementById('preview-theme-btn').addEventListener('click', () => {
  if (!currentTheme) {
    alert('Aucun thème chargé');
    return;
  }

  try {
    // Get edited JSON from textarea
    const editor = document.getElementById('theme-json-editor');
    if (editor) {
      currentTheme = JSON.parse(editor.value);
    }

    // Open preview in new tab
    window.open(`/${currentThemeName}`, '_blank');
  } catch (error) {
    alert('Erreur dans le JSON. Veuillez vérifier le format.');
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
});
