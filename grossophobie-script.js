// Parallax Interactive Script
// Gestion des données, interactions et mode sensible
// Support pour chargement dynamique depuis window.THEME_DATA ou fichier JSON

let data = null;
let safeMode = false;

// Chargement des données au démarrage
$(document).ready(function() {
  loadData();
  setupEventListeners();
});

// Chargement du fichier JSON (dynamique depuis Cloudflare ou fichier local)
async function loadData() {
  try {
    // Si les données sont déjà injectées par Cloudflare Pages Function
    if (window.THEME_DATA) {
      data = window.THEME_DATA;
      console.log('Données chargées depuis window.THEME_DATA:', data);
      displayTriggerWarning();
      return;
    }

    // Sinon, charger depuis le fichier JSON (mode local/legacy)
    const themeName = window.THEME_NAME || 'grossophobie';
    const response = await fetch(`${themeName}.json`);
    data = await response.json();
    console.log('Données chargées depuis fichier JSON:', data);
    displayTriggerWarning();
  } catch (error) {
    console.error('Erreur de chargement des données:', error);
    alert('Erreur lors du chargement des données. Veuillez rafraîchir la page.');
  }
}

// Affichage du Trigger Warning Modal
function displayTriggerWarning() {
  const warningText = document.getElementById('trigger-warning-text');

  let html = `<p>${data.triggerWarning.global}</p>`;

  // Affichage des contacts d'aide
  html += `<div style="margin-top: 1.5rem; text-align: left;">`;
  html += `<p><strong>Contacts d'aide en France :</strong></p>`;
  data.triggerWarning.contacts.france.forEach(contact => {
    html += `<p>• ${contact.name} : <strong>${contact.number}</strong> - ${contact.description}</p>`;
  });
  html += `</div>`;

  warningText.innerHTML = html;
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
  // Boutons du modal
  $('#accept-warning').on('click', function() {
    $('#trigger-warning-modal').removeClass('active');
    renderAllSections();
  });

  $('#safe-mode').on('click', function() {
    safeMode = true;
    $('#trigger-warning-modal').removeClass('active');
    renderAllSections();
    applySafeMode();
  });

  // Toggle safe mode dans la navigation
  $('#safe-mode-toggle').on('change', function() {
    safeMode = this.checked;
    if (safeMode) {
      applySafeMode();
    } else {
      removeSafeMode();
    }
  });

  // Navigation smooth scroll (adapté au parallax)
  $('.nav-links a').on('click', function(e) {
    e.preventDefault();
    const target = $(this).attr('href');
    const section = $(target);
    if (section.length) {
      // Scroll adapté au parallax horizontal
      const scrollWrapper = $('.horizontal-scroll-wrapper');
      const sectionIndex = $('.section').index(section);
      scrollWrapper.scrollTop(sectionIndex * (window.innerHeight * 0.5));
    }
  });
}

// Rendu de toutes les sections
function renderAllSections() {
  renderHero();
  renderParallaxImages();
  renderIntroduction();
  renderPublics();
  renderArguments();
  renderPhrases();
  renderPositif();
  renderCampagnes();
  renderRessources();
  renderCTA();
  renderFooter();
  renderPetitionBadge();
}

// Rendu de la section Hero
function renderHero() {
  $('#main-title').text(data.meta.title);
  $('#main-subtitle').text(data.meta.subtitle);
  // Update navigation title
  $('#nav-title').text(data.meta.title || '');
}

// Rendu des images parallax
function renderParallaxImages() {
  if (!data.parallaxImages || !data.parallaxImages.enabled) {
    return;
  }

  // Trouver une section existante pour insérer les images ou créer une nouvelle section
  const heroSection = $('#hero');

  data.parallaxImages.images.forEach((image, index) => {
    const speedClass = image.speed || 'normal';
    const imageHtml = `
      <div class="img-wrapper ${speedClass}" style="order: ${image.position || index}">
        <a href="${image.url}" data-lightbox="parallax-images" data-title="${image.alt}">
          <img src="${image.url}" alt="${image.alt}" style="max-width: 45vh; max-height: 50vh; border-radius: 15px; box-shadow: 0px 12px 50px rgba(0, 0, 0, 0.5);">
        </a>
      </div>
    `;

    // Insérer après le hero
    heroSection.after(imageHtml);
  });
}

// Rendu de l'introduction
function renderIntroduction() {
  const container = $('#intro-content');
  container.html(`<p>${data.introduction.content}</p>`);

  const statsContainer = $('#intro-stats');
  let html = '';
  html += `<div class="stat-highlight-item">
    <div class="stat-highlight-label">🇫🇷 France</div>
    <div class="stat-highlight-value">${data.introduction.statistics.france}</div>
  </div>`;
  html += `<div class="stat-highlight-item">
    <div class="stat-highlight-label">🌍 Global</div>
    <div class="stat-highlight-value">${data.introduction.statistics.global}</div>
  </div>`;
  statsContainer.html(html);
}

// Rendu des publics cibles
function renderPublics() {
  const container = $('#publics-grid');
  let html = '';

  data.publicCibles.audiences.forEach(audience => {
    html += `
      <div class="public-card">
        <div class="public-icon">${audience.icon}</div>
        <h3 class="public-name">${audience.name}</h3>
        <p class="public-message">${audience.message}</p>
        <div class="public-resources">
          <ul>
            ${audience.resources.map(resource => `<li>${resource}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  });

  container.html(html);
}

// Rendu des arguments
function renderArguments() {
  const container = $('#arguments-container');
  let html = '';

  // Affichage par groupes de 5 pour faciliter la lecture
  const itemsPerPage = 5;
  let currentPage = 0;

  data.arguments.items.forEach((arg, index) => {
    html += `
      <div class="argument-card" data-page="${Math.floor(index / itemsPerPage)}">
        <h3 class="argument-title">${arg.id}. ${arg.title}</h3>
        <div class="argument-stats">
          <div class="stat-item">
            <div class="stat-label">🇺🇸 États-Unis</div>
            <div class="stat-value">${arg.statUS}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">🇫🇷 France</div>
            <div class="stat-value">${arg.statFrance}</div>
          </div>
        </div>
        <div class="argument-impact">
          <strong>Impact :</strong> ${arg.impact}
        </div>
      </div>
    `;
  });

  container.html(html);

  // Afficher tous les arguments (pas de pagination pour le parallax)
  $('.argument-card').show();
}

// Rendu des phrases discriminantes (avec trigger warning)
function renderPhrases() {
  const container = $('#phrases-grid');
  let html = '';

  data.phrasesDiscriminantes.items.forEach(item => {
    html += `
      <div class="phrase-card" data-id="${item.id}">
        <div class="phrase-front">
          <div class="phrase-categorie">${item.categorie}</div>
          <p class="phrase-text">"${item.phrase}"</p>
          <p class="flip-hint">Cliquez pour voir le démenti →</p>
        </div>
        <div class="phrase-back">
          <p class="dementi-text">${item.dementi}</p>
          <p class="flip-hint">Cliquez pour revenir ←</p>
        </div>
      </div>
    `;
  });

  container.html(html);

  // Gestion du flip des cartes
  $('.phrase-card').on('click', function() {
    $(this).toggleClass('flipped');
  });
}

// Rendu des arguments positifs
function renderPositif() {
  const container = $('#positif-grid');
  let html = '';

  data.argumentsPositifs.items.forEach(item => {
    html += `
      <div class="positif-card">
        <h3 class="positif-title">${item.title}</h3>
        <p class="positif-description">${item.description}</p>
        <div class="positif-impact">✨ ${item.impact}</div>
      </div>
    `;
  });

  container.html(html);
}

// Rendu des campagnes
function renderCampagnes() {
  const container = $('#campagnes-container');
  let html = '';

  data.campagnesEfficaces.items.forEach(campagne => {
    html += `
      <div class="campagne-card">
        <div class="campagne-header">
          <h3 class="campagne-name">${campagne.name}</h3>
          <div class="campagne-meta">
            <span>📅 ${campagne.period}</span>
            <span>🌍 ${campagne.zone}</span>
          </div>
        </div>
        <p class="campagne-description">${campagne.description}</p>
        <div class="campagne-impact">
          <strong>Impact :</strong> ${campagne.impact}
        </div>
        <p class="campagne-lecon"><strong>Leçon :</strong> ${campagne.lecon}</p>
      </div>
    `;
  });

  container.html(html);
}

// Rendu des ressources
function renderRessources() {
  const container = $('#ressources-content');
  let html = '';

  // Associations
  html += `<div class="ressources-section">
    <h3>Associations et Collectifs</h3>
    <ul class="ressources-list">`;
  data.ressources.associations.forEach(asso => {
    html += `
      <li class="ressource-item">
        <div class="ressource-name">${asso.name}</div>
        <div class="ressource-type">${asso.type}</div>
        <div class="ressource-action">${asso.action}</div>
        ${asso.social ? `<div style="color: var(--primary-color); margin-top: 0.5rem;">${asso.social}</div>` : ''}
      </li>
    `;
  });
  html += `</ul></div>`;

  // Guides
  html += `<div class="ressources-section">
    <h3>Guides et Outils</h3>
    <ul class="ressources-list">`;
  data.ressources.guides.forEach(guide => {
    html += `
      <li class="ressource-item">
        <div class="ressource-name">${guide.titre}</div>
        <div class="ressource-type">${guide.source}</div>
        <div class="ressource-action">${guide.description}</div>
      </li>
    `;
  });
  html += `</ul></div>`;

  // Livres
  html += `<div class="ressources-section">
    <h3>Livres et Médias</h3>
    <ul class="ressources-list">`;
  data.ressources.livres.forEach(livre => {
    html += `
      <li class="ressource-item">
        <div class="ressource-name">${livre.titre}</div>
        <div class="ressource-type">${livre.source}</div>
        <div class="ressource-action">${livre.description}</div>
      </li>
    `;
  });
  html += `</ul></div>`;

  container.html(html);
}

// Rendu du Call to Action
function renderCTA() {
  const container = $('#cta-grid');
  let html = '';

  data.callToAction.actions.forEach(action => {
    const isPrimary = action.type === 'primary';
    const cardClass = isPrimary ? 'cta-card primary' : 'cta-card';

    html += `
      <div class="${cardClass}" data-url="${action.url || ''}" onclick="${action.url ? `window.open('${action.url}', '_blank')` : 'void(0)'}">
        <div class="cta-icon">${getIconForAction(action.icon)}</div>
        <h3 class="cta-title">${action.titre}</h3>
        <p class="cta-description">${action.description}</p>
      </div>
    `;
  });

  container.html(html);
}

// Rendu du footer
function renderFooter() {
  const container = $('#footer-content');
  let html = `
    <p>${data.footer.message}</p>
    <p class="footer-credit">${data.footer.credit}</p>
    <p style="margin-top: 1rem; font-size: 0.9rem;">${data.footer.contact}</p>
  `;
  container.html(html);
}

// Application du mode sensible
function applySafeMode() {
  console.log('Mode sensible activé');
  // Masquer les sections avec trigger warning
  $('.trigger-content').addClass('hidden-safe');
  $('.trigger-section').css('opacity', '0.5');

  // Ajouter un message informatif
  if ($('#safe-mode-message').length === 0) {
    $('body').append(`
      <div id="safe-mode-message" style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--warning-color);
        color: var(--bg-dark);
        padding: 1rem 2rem;
        border-radius: 10px;
        font-weight: 600;
        z-index: 9999;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      ">
        🛡️ Mode sensible activé - Contenus difficiles masqués
      </div>
    `);
  }
}

// Retrait du mode sensible
function removeSafeMode() {
  console.log('Mode sensible désactivé');
  $('.trigger-content').removeClass('hidden-safe');
  $('.trigger-section').css('opacity', '1');
  $('#safe-mode-message').remove();
}

// Helper: Obtenir l'icône pour une action
function getIconForAction(iconName) {
  const icons = {
    'pen': '✍️',
    'share': '📢',
    'book-open': '📖',
    'message': '💬',
    'heart': '❤️'
  };
  return icons[iconName] || '📌';
}

// Helper: Scroll smooth adapté au parallax
function smoothScrollToSection(sectionId) {
  const section = $(sectionId);
  if (section.length) {
    const scrollWrapper = $('.horizontal-scroll-wrapper');
    const sectionIndex = $('.section').index(section);
    const scrollPosition = sectionIndex * (window.innerHeight * 0.5);

    scrollWrapper.animate({
      scrollTop: scrollPosition
    }, 800, 'swing');
  }
}

// Rendu du badge de pétition
function renderPetitionBadge() {
  const badge = $('#petition-badge');

  if (data.meta && data.meta.petition && data.meta.petition.url) {
    // Configurer le lien et l'aria-label
    badge.attr('href', data.meta.petition.url);
    badge.attr('aria-label', data.meta.petition.title || 'Signer la pétition');

    // Optionnel : mettre à jour le texte si vous voulez le personnaliser
    if (data.meta.petition.title) {
      badge.find('.badge-text').text('Signer la pétition');
    }

    // Tracking des clics (optionnel)
    badge.on('click', function() {
      console.log('Clic sur le badge de pétition:', data.meta.petition.url);
      // Vous pouvez ajouter du tracking analytics ici
    });

    console.log('Badge de pétition configuré:', data.meta.petition.url);
  } else {
    // Masquer le badge si pas de pétition
    badge.hide();
    console.log('Aucune pétition définie, badge masqué');
  }
}

// Gestion du resize pour adapter le parallax
$(window).on('resize', function() {
  // Recalculer les positions si nécessaire
  console.log('Window resized');
});

// Log pour debug
console.log('Grossophobie Script chargé et prêt');
