// ============================================
// PARALLAX GROSSOPHOBIE - MAIN SCRIPT
// ============================================
// Gestion des données, interactions et mode sensible
// Support pour chargement dynamique depuis window.THEME_DATA ou fichier JSON

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================

const PARALLAX_SCROLL_MULTIPLIER = 0.5;
const SCROLL_ANIMATION_DURATION = 800;
const THEME_TOGGLE_ANIMATION_DURATION = 300;

const ICONS = {
  pen: '✍️',
  share: '📢',
  'book-open': '📖',
  message: '💬',
  heart: '❤️',
  default: '📌'
};

// ============================================
// STATE MANAGEMENT
// ============================================

let data = null;
let safeMode = false;

// ============================================
// INITIALIZATION
// ============================================

$(document).ready(function() {
  initializeApp();
});

async function initializeApp() {
  await loadData();
  setupEventListeners();
  initThemeToggle();
  initMobileMenu();
  initTOCToggle();
}

// ============================================
// DATA LOADING
// ============================================

/**
 * Charge les données du thème depuis window.THEME_DATA (Cloudflare) ou fichier JSON (local)
 */
async function loadData() {
  try {
    if (window.THEME_DATA) {
      data = window.THEME_DATA;
      console.log('✓ Données chargées depuis window.THEME_DATA');
    } else {
      const themeName = window.THEME_NAME || 'grossophobie';
      const response = await fetch(`${themeName}.json`);
      data = await response.json();
      console.log('✓ Données chargées depuis fichier JSON');
    }

    displayTriggerWarning();
  } catch (error) {
    console.error('✗ Erreur de chargement des données:', error);
    alert('Erreur lors du chargement des données. Veuillez rafraîchir la page.');
  }
}

// ============================================
// TRIGGER WARNING MODAL
// ============================================

/**
 * Affiche le modal d'avertissement avec contacts d'aide et lien pétition
 */
function displayTriggerWarning() {
  const warningText = document.getElementById('trigger-warning-text');

  const htmlParts = [
    `<p>${data.triggerWarning.global}</p>`,
    buildContactsHTML(),
  ];

  warningText.innerHTML = htmlParts.join('');
  injectPetitionLink('#modal-petition-container');
}

/**
 * Construit le HTML des contacts d'aide
 */
function buildContactsHTML() {
  const contacts = data.triggerWarning.contacts.france;
  const contactsHTML = contacts.map(contact =>
    `<p>• ${contact.name} : <strong>${contact.number}</strong> - ${contact.description}</p>`
  ).join('');

  return `
    <div style="margin-top: 1.5rem; text-align: left;">
      <p><strong>Contacts d'aide en France :</strong></p>
      ${contactsHTML}
    </div>
  `;
}

/**
 * Injecte le lien de la pétition dans un conteneur
 */
function injectPetitionLink(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container || !data.meta?.petition?.url) return;

  const petition = data.meta.petition;
  container.innerHTML = `
    <a href="${petition.url}"
       target="_blank"
       rel="noopener"
       class="btn-petition-modal"
       aria-label="${petition.title || 'Signer la pétition'}">
      ✍️ ${petition.title || 'Signer la Pétition'}
    </a>
  `;

  console.log('✓ Lien de pétition ajouté dans', containerSelector);
}

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Configure tous les écouteurs d'événements de l'application
 */
function setupEventListeners() {
  setupModalListeners();
  setupSafeModeListeners();
  setupNavigationListeners();
}

function setupModalListeners() {
  $('#accept-warning').on('click', () => {
    $('#trigger-warning-modal').removeClass('active');
    renderAllSections();
  });

  $('#safe-mode').on('click', () => {
    safeMode = true;
    $('#trigger-warning-modal').removeClass('active');
    renderAllSections();
    applySafeMode();
  });
}

function setupSafeModeListeners() {
  $('#safe-mode-toggle').on('change', function() {
    safeMode = this.checked;
    safeMode ? applySafeMode() : removeSafeMode();
  });
}

function setupNavigationListeners() {
  $('.nav-links a').on('click', function(e) {
    e.preventDefault();
    const targetSelector = $(this).attr('href');
    smoothScrollToSection(targetSelector);
  });
}

// ============================================
// RENDERING - MAIN ORCHESTRATOR
// ============================================

/**
 * Rend toutes les sections du site dans l'ordre
 */
function renderAllSections() {
  const renderFunctions = [
    renderHero,
    renderParallaxImages,
    renderIntroduction,
    renderPublics,
    renderArguments,
    renderIMCCritique,
    renderPhrases,
    renderPositif,
    renderCampagnes,
    renderRessources,
    renderCTA,
    renderFooter,
    renderPetitionBadge
  ];

  renderFunctions.forEach(fn => fn());
}

// ============================================
// RENDERING - INDIVIDUAL SECTIONS
// ============================================

function renderHero() {
  $('#main-title').text(data.meta.title);
  $('#main-subtitle').text(data.meta.subtitle);
  $('#nav-title').text(data.meta.title || '');
}

function renderParallaxImages() {
  if (!data.parallaxImages?.enabled) return;

  const heroSection = $('#hero');

  data.parallaxImages.images.forEach((image, index) => {
    const imageHTML = createParallaxImageHTML(image, index);
    heroSection.after(imageHTML);
  });
}

function createParallaxImageHTML(image, index) {
  const speedClass = image.speed || 'normal';
  const order = image.position || index;

  return `
    <div class="img-wrapper ${speedClass}" style="order: ${order}">
      <a href="${image.url}" data-lightbox="parallax-images" data-title="${image.alt}">
        <img src="${image.url}"
             alt="${image.alt}"
             loading="lazy"
             style="max-width: 45vh; max-height: 50vh; border-radius: 15px; box-shadow: 0px 12px 50px rgba(0, 0, 0, 0.5);">
      </a>
    </div>
  `;
}

function renderIntroduction() {
  $('#intro-content').html(`<p>${data.introduction.content}</p>`);

  const stats = data.introduction.statistics;
  const statsHTML = `
    <div class="stat-highlight-item">
      <div class="stat-highlight-label">🇫🇷 France</div>
      <div class="stat-highlight-value">${stats.france}</div>
    </div>
    <div class="stat-highlight-item">
      <div class="stat-highlight-label">🌍 Global</div>
      <div class="stat-highlight-value">${stats.global}</div>
    </div>
  `;

  $('#intro-stats').html(statsHTML);
}

function renderPublics() {
  const audiences = data.publicCibles.audiences;
  const cardsHTML = audiences.map(createPublicCardHTML).join('');
  $('#publics-grid').html(cardsHTML);
}

function createPublicCardHTML(audience) {
  const resourcesList = audience.resources
    .map(resource => `<li>${resource}</li>`)
    .join('');

  return `
    <div class="public-card">
      <div class="public-icon">${audience.icon}</div>
      <h3 class="public-name">${audience.name}</h3>
      <p class="public-message">${audience.message}</p>
      <div class="public-resources">
        <ul>${resourcesList}</ul>
      </div>
    </div>
  `;
}

function renderArguments() {
  const args = data.arguments.items;
  const cardsHTML = args.map(createArgumentCardHTML).join('');

  $('#arguments-container').html(cardsHTML);

  setupFlipCardListeners();
  adjustFlipContainerHeights();
}

function createArgumentCardHTML(arg) {
  const sourcesHTML = arg.sources?.length > 0
    ? createSourcesListHTML(arg.sources)
    : '';

  return `
    <div class="argument-card" data-arg-id="${arg.id}">
      <h3 class="argument-title">${arg.id}. ${arg.title}</h3>

      <div class="argument-flip-container">
        ${createFlipCardFaceHTML('front', arg.statFrance, '🇫🇷', 'us', 'Voir statistique États-Unis', '🇺🇸')}
        ${createFlipCardFaceHTML('back', arg.statUS, '🇺🇸', 'fr', 'Voir statistique France', '🇫🇷')}
      </div>

      <div class="argument-impact">
        <strong>Impact :</strong> ${arg.impact}
      </div>

      ${sourcesHTML}
    </div>
  `;
}

function createFlipCardFaceHTML(faceType, statText, flagEmoji, targetCountry, ariaLabel, buttonFlagEmoji) {
  return `
    <div class="argument-face argument-face-${faceType}">
      <div class="argument-stat-display">
        <div class="stat-flag">${flagEmoji}</div>
        <div class="stat-value-main">${statText}</div>
      </div>
      <button class="flip-flag-btn"
              data-country="${targetCountry}"
              aria-label="${ariaLabel}">
        <span class="flip-flag">${buttonFlagEmoji}</span>
      </button>
    </div>
  `;
}

function createSourcesListHTML(sources) {
  const sourceItems = sources
    .map(source => `
      <li>
        <a href="${source.url}" target="_blank" rel="noopener" class="source-link">
          ${source.title}
        </a>
      </li>
    `)
    .join('');

  return `
    <div class="argument-sources">
      <strong>📚 Sources :</strong>
      <ul class="sources-list">${sourceItems}</ul>
    </div>
  `;
}

function setupFlipCardListeners() {
  $('.flip-flag-btn').on('click', function(e) {
    e.stopPropagation();
    $(this).closest('.argument-card').toggleClass('flipped');
  });
}

/**
 * Ajuste dynamiquement la hauteur des flip containers pour éviter la superposition
 */
function adjustFlipContainerHeights() {
  const adjustSingleContainer = (container) => {
    const $container = $(container);
    const frontHeight = $container.find('.argument-face-front').outerHeight();
    const backHeight = $container.find('.argument-face-back').outerHeight();
    const maxHeight = Math.max(frontHeight, backHeight);

    $container.css('min-height', `${maxHeight}px`);
  };

  // Ajustement initial
  $('.argument-flip-container').each(function() {
    adjustSingleContainer(this);
  });

  // Réajustement au resize
  $(window).on('resize', () => {
    $('.argument-flip-container').each(function() {
      adjustSingleContainer(this);
    });
  });
}

function renderIMCCritique() {
  if (!data.imcCritique) return;

  const container = $('#imc-content');
  if (!container.length) return;

  const htmlParts = [
    renderIMCLimites(),
    renderIMCDimensionRaciale(),
    renderIMCAlternatives(),
    renderIMCRecommendations()
  ];

  container.html(htmlParts.join(''));
  console.log('✓ Section IMC Critique rendue');
}

function renderIMCLimites() {
  const cardsHTML = data.imcCritique.limites
    .map(limite => `
      <div class="imc-card">
        <div class="imc-card-icon">${limite.icon}</div>
        <h4 class="imc-card-title">${limite.titre}</h4>
        <p class="imc-card-description">${limite.description}</p>
      </div>
    `)
    .join('');

  return `
    <div class="imc-section">
      <h3 class="imc-section-title">📌 Principales Limites</h3>
      <div class="imc-grid">${cardsHTML}</div>
    </div>
  `;
}

function renderIMCDimensionRaciale() {
  if (!data.imcCritique.dimensionRaciale) return '';

  const points = data.imcCritique.dimensionRaciale.points
    .map(point => `<li>${point}</li>`)
    .join('');

  return `
    <div class="imc-section imc-raciale">
      <h3 class="imc-section-title">🌍 ${data.imcCritique.dimensionRaciale.titre}</h3>
      <ul class="imc-list">${points}</ul>
    </div>
  `;
}

function renderIMCAlternatives() {
  const altsHTML = data.imcCritique.alternatives
    .map(alt => `
      <div class="imc-alternative">
        <div class="imc-alt-header">
          <span class="imc-alt-icon">${alt.icon}</span>
          <strong>${alt.nom}</strong>
        </div>
        <p>${alt.description}</p>
      </div>
    `)
    .join('');

  return `
    <div class="imc-section">
      <h3 class="imc-section-title">✨ Alternatives et Mesures Plus Proches de la Réalité</h3>
      <div class="imc-alternatives">${altsHTML}</div>
    </div>
  `;
}

function renderIMCRecommendations() {
  const recsHTML = data.imcCritique.recommendations
    .map(rec => `<li>${rec}</li>`)
    .join('');

  return `
    <div class="imc-section imc-recommendations">
      <h3 class="imc-section-title">💡 Ce que Vous Pouvez Faire</h3>
      <ul class="imc-list imc-action-list">${recsHTML}</ul>
    </div>
  `;
}

function renderPhrases() {
  const cardsHTML = data.phrasesDiscriminantes.items
    .map(createPhraseCardHTML)
    .join('');

  $('#phrases-grid').html(cardsHTML);

  setupPhraseCardListeners();
  initTriggerContentToggle();
}

function createPhraseCardHTML(item) {
  const sourcesHTML = item.sources?.length > 0
    ? createSourcesListHTML(item.sources)
    : '';

  return `
    <div class="phrase-card" data-id="${item.id}">
      <div class="phrase-front">
        <div class="phrase-categorie">${item.categorie}</div>
        <p class="phrase-text">"${item.phrase}"</p>
        <p class="flip-hint">Cliquez pour voir le démenti →</p>
      </div>
      <div class="phrase-back">
        <p class="dementi-text">${item.dementi}</p>
        ${sourcesHTML}
        <p class="flip-hint">Cliquez pour revenir ←</p>
      </div>
    </div>
  `;
}

function setupPhraseCardListeners() {
  $('.phrase-card').on('click', function() {
    $(this).toggleClass('flipped');
  });
}

/**
 * Initialise le bouton toggle pour masquer/afficher le contenu sensible
 */
function initTriggerContentToggle() {
  const toggleBtn = $('#toggle-trigger-content');
  const phrasesGrid = $('#phrases-grid');
  const toggleIcon = toggleBtn.find('.toggle-icon');
  const toggleText = toggleBtn.find('.toggle-text');

  let isContentHidden = false;

  toggleBtn.on('click', () => {
    isContentHidden = !isContentHidden;

    if (isContentHidden) {
      phrasesGrid.addClass('trigger-hidden');
      toggleIcon.text('👁️‍🗨️');
      toggleText.text('Afficher');
      toggleBtn.attr('aria-label', 'Afficher le contenu sensible');
    } else {
      phrasesGrid.removeClass('trigger-hidden');
      toggleIcon.text('👁️');
      toggleText.text('Masquer');
      toggleBtn.attr('aria-label', 'Masquer le contenu sensible');
    }
  });
}

function renderPositif() {
  const cardsHTML = data.argumentsPositifs.items
    .map(item => `
      <div class="positif-card">
        <h3 class="positif-title">${item.title}</h3>
        <p class="positif-description">${item.description}</p>
        <div class="positif-impact">✨ ${item.impact}</div>
      </div>
    `)
    .join('');

  $('#positif-grid').html(cardsHTML);
}

function renderCampagnes() {
  const cardsHTML = data.campagnesEfficaces.items
    .map(createCampagneCardHTML)
    .join('');

  $('#campagnes-container').html(cardsHTML);
}

function createCampagneCardHTML(campagne) {
  const sourcesHTML = campagne.sources?.length > 0
    ? createSourcesListHTML(campagne.sources)
    : '';

  return `
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
      ${sourcesHTML}
    </div>
  `;
}

function renderRessources() {
  const sectionsHTML = [
    renderRessourcesSection('Associations et Collectifs', data.ressources.associations, createAssociationItemHTML),
    renderRessourcesSection('Guides et Outils', data.ressources.guides, createGuideItemHTML),
    renderRessourcesSection('Livres et Médias', data.ressources.livres, createLivreItemHTML)
  ].join('');

  $('#ressources-content').html(sectionsHTML);
}

function renderRessourcesSection(title, items, itemCreator) {
  const itemsHTML = items.map(itemCreator).join('');

  return `
    <div class="ressources-section">
      <h3>${title}</h3>
      <ul class="ressources-list">${itemsHTML}</ul>
    </div>
  `;
}

function createAssociationItemHTML(asso) {
  const nameHTML = asso.url
    ? `<a href="${asso.url}" target="_blank" rel="noopener" class="ressource-link">${asso.name}</a>`
    : asso.name;

  const socialHTML = asso.social
    ? `<div style="color: var(--primary-color); margin-top: 0.5rem;">${asso.social}</div>`
    : '';

  return `
    <li class="ressource-item">
      <div class="ressource-name">${nameHTML}</div>
      <div class="ressource-type">${asso.type}</div>
      <div class="ressource-action">${asso.action}</div>
      ${socialHTML}
    </li>
  `;
}

function createGuideItemHTML(guide) {
  const titleHTML = guide.url
    ? `<a href="${guide.url}" target="_blank" rel="noopener" class="ressource-link">${guide.titre}</a>`
    : guide.titre;

  return `
    <li class="ressource-item">
      <div class="ressource-name">${titleHTML}</div>
      <div class="ressource-type">${guide.source}</div>
      <div class="ressource-action">${guide.description}</div>
    </li>
  `;
}

function createLivreItemHTML(livre) {
  const titleHTML = livre.url
    ? `<a href="${livre.url}" target="_blank" rel="noopener" class="ressource-link">${livre.titre}</a>`
    : livre.titre;

  return `
    <li class="ressource-item">
      <div class="ressource-name">${titleHTML}</div>
      <div class="ressource-type">${livre.source}</div>
      <div class="ressource-action">${livre.description}</div>
    </li>
  `;
}

function renderCTA() {
  const cardsHTML = data.callToAction.actions
    .map(createCTACardHTML)
    .join('');

  $('#cta-grid').html(cardsHTML);

  // Initialiser les événements interactifs
  initCTAInteractions();
}

function createCTACardHTML(action) {
  const isPrimary = action.type === 'primary';
  const cardClass = isPrimary ? 'cta-card primary' : 'cta-card';

  // Carte interactive avec partage
  if (action.interactive && action.shareText) {
    return createShareCardHTML(action, cardClass);
  }

  // Carte interactive avec ressources
  if (action.interactive && action.ressources) {
    return createFlipCardWithRessources(action, cardClass);
  }

  // Carte interactive avec personnalités
  if (action.interactive && action.personalities) {
    return createFlipCardWithPersonalities(action, cardClass);
  }

  // Carte simple avec lien
  const onClick = action.url ? `window.open('${action.url}', '_blank')` : 'void(0)';

  return `
    <div class="${cardClass}"
         data-url="${action.url || ''}"
         onclick="${onClick}">
      <div class="cta-icon">${getIconForAction(action.icon)}</div>
      <h3 class="cta-title">${action.titre}</h3>
      <p class="cta-description">${action.description}</p>
    </div>
  `;
}

function createShareCardHTML(action, cardClass) {
  return `
    <div class="${cardClass} cta-share-card">
      <div class="cta-icon">${getIconForAction(action.icon)}</div>
      <h3 class="cta-title">${action.titre}</h3>
      <p class="cta-description">${action.description}</p>
      <div class="share-buttons">
        <button class="share-btn copy-url-btn" data-url="${action.url}" title="Copier le lien">
          🔗 Copier le lien
        </button>
        <button class="share-btn twitter-btn" data-text="${action.shareText}" title="Partager sur X/Twitter">
          𝕏 Twitter
        </button>
        <button class="share-btn facebook-btn" data-url="${action.url}" title="Partager sur Facebook">
          📘 Facebook
        </button>
        <button class="share-btn linkedin-btn" data-url="${action.url}" data-text="${action.shareText}" title="Partager sur LinkedIn">
          💼 LinkedIn
        </button>
      </div>
    </div>
  `;
}

function createFlipCardWithRessources(action, cardClass) {
  const ressourcesHTML = action.ressources
    .map(res => `
      <li class="ressource-flip-item">
        <a href="${res.url}" target="_blank" rel="noopener">
          📚 ${res.titre}
        </a>
        <span class="ressource-source">${res.source}</span>
      </li>
    `)
    .join('');

  return `
    <div class="${cardClass} cta-flip-card">
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <div class="cta-icon">${getIconForAction(action.icon)}</div>
          <h3 class="cta-title">${action.titre}</h3>
          <p class="cta-description">${action.description}</p>
          <button class="flip-card-btn">Voir les ressources →</button>
        </div>
        <div class="flip-card-back">
          <h3 class="flip-back-title">Ressources pédagogiques</h3>
          <ul class="ressources-flip-list">
            ${ressourcesHTML}
          </ul>
          <button class="flip-card-btn flip-back-btn">← Retour</button>
        </div>
      </div>
    </div>
  `;
}

function createFlipCardWithPersonalities(action, cardClass) {
  const personalitiesHTML = action.personalities
    .map(person => `
      <li class="personality-item">
        <a href="${person.url}" target="_blank" rel="noopener" class="personality-link">
          <strong>${person.nom}</strong>
          <span class="instagram-handle">${person.instagram}</span>
        </a>
        <p class="personality-description">${person.description}</p>
      </li>
    `)
    .join('');

  return `
    <div class="${cardClass} cta-flip-card">
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <div class="cta-icon">${getIconForAction(action.icon)}</div>
          <h3 class="cta-title">${action.titre}</h3>
          <p class="cta-description">${action.description}</p>
          <button class="flip-card-btn">Découvrir les comptes →</button>
        </div>
        <div class="flip-card-back">
          <h3 class="flip-back-title">Comptes Instagram inspirants</h3>
          <ul class="personalities-list">
            ${personalitiesHTML}
          </ul>
          <button class="flip-card-btn flip-back-btn">← Retour</button>
        </div>
      </div>
    </div>
  `;
}

function initCTAInteractions() {
  // Gestion du partage : copier l'URL
  $('.copy-url-btn').on('click', function(e) {
    e.stopPropagation();
    const url = $(this).data('url');
    copyToClipboard(url);
    $(this).text('✓ Copié !').prop('disabled', true);
    setTimeout(() => {
      $(this).text('🔗 Copier le lien').prop('disabled', false);
    }, 2000);
  });

  // Gestion du partage : Twitter
  $('.twitter-btn').on('click', function(e) {
    e.stopPropagation();
    const text = $(this).data('text');
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank');
  });

  // Gestion du partage : Facebook
  $('.facebook-btn').on('click', function(e) {
    e.stopPropagation();
    const url = $(this).data('url');
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
  });

  // Gestion du partage : LinkedIn
  $('.linkedin-btn').on('click', function(e) {
    e.stopPropagation();
    const url = $(this).data('url');
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedinUrl, '_blank');
  });

  // Gestion des cartes retournables
  $('.flip-card-btn').on('click', function(e) {
    e.stopPropagation();
    const card = $(this).closest('.cta-flip-card');
    card.toggleClass('flipped');
  });
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text);
  } else {
    // Fallback pour navigateurs plus anciens
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
    document.body.removeChild(textArea);
  }
}

function renderFooter() {
  const html = `
    <p>${data.footer.message}</p>
    <p style="margin-top: 1rem; font-size: 0.9rem;">${data.footer.contact}</p>
  `;

  $('#footer-content').html(html);
}

function renderPetitionBadge() {
  const badge = $('#petition-badge');
  const petition = data.meta?.petition;

  if (!petition?.url) {
    badge.hide();
    console.log('✗ Aucune pétition définie, badge masqué');
    return;
  }

  badge.attr('href', petition.url);
  badge.attr('aria-label', petition.title || 'Signer la pétition');

  if (petition.title) {
    badge.find('.badge-text').text('Signer la pétition');
  }

  badge.on('click', () => {
    console.log('✓ Clic sur le badge de pétition:', petition.url);
  });

  console.log('✓ Badge de pétition configuré');
}

// ============================================
// SAFE MODE
// ============================================

/**
 * Active le mode sensible qui masque les contenus difficiles
 */
function applySafeMode() {
  console.log('🛡️ Mode sensible activé');

  $('.trigger-content').addClass('hidden-safe');
  $('.trigger-section').css('opacity', '0.5');

  if ($('#safe-mode-message').length === 0) {
    $('body').append(createSafeModeMessageHTML());
  }
}

function createSafeModeMessageHTML() {
  return `
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
  `;
}

/**
 * Désactive le mode sensible
 */
function removeSafeMode() {
  console.log('✓ Mode sensible désactivé');

  $('.trigger-content').removeClass('hidden-safe');
  $('.trigger-section').css('opacity', '1');
  $('#safe-mode-message').remove();
}

// ============================================
// THEME TOGGLE - DARK/LIGHT MODE
// ============================================

/**
 * Initialise le basculement de thème clair/sombre
 */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (!themeToggleBtn) return;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  themeToggleBtn.addEventListener('click', handleThemeToggle);

  console.log('✓ Theme toggle initialisé:', savedTheme);
}

function handleThemeToggle() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  applyTheme(newTheme);
  localStorage.setItem('theme', newTheme);
  animateThemeButton(this);
}

function animateThemeButton(button) {
  button.style.transform = 'rotate(360deg)';
  setTimeout(() => {
    button.style.transform = 'rotate(0deg)';
  }, THEME_TOGGLE_ANIMATION_DURATION);
}

/**
 * Applique un thème (dark ou light)
 */
function applyTheme(theme) {
  const themeIcon = document.querySelector('.theme-icon');
  const linkElement = document.querySelector('link[href*="grossophobie-style"]');

  document.documentElement.setAttribute('data-theme', theme);

  if (linkElement) {
    const isLight = theme === 'light';
    linkElement.href = isLight ? 'grossophobie-style-light.css' : 'grossophobie-style.css';

    if (themeIcon) {
      themeIcon.textContent = isLight ? '☀️' : '🌙';
    }
  }

  console.log('✓ Thème appliqué:', theme);
}

/**
 * Détecte la préférence système de thème
 */
function detectSystemTheme() {
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

// Écouter les changements de préférence système
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const newTheme = e.matches ? 'dark' : 'light';
    if (!localStorage.getItem('theme')) {
      applyTheme(newTheme);
    }
  });
}

// ============================================
// MOBILE MENU
// ============================================

/**
 * Initialise le menu burger mobile
 */
function initMobileMenu() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (!mobileMenuToggle || !navLinks) return;

  mobileMenuToggle.addEventListener('click', () => toggleMobileMenu(navLinks, mobileMenuToggle));

  setupMobileMenuNavigation(navLinks, mobileMenuToggle);
  setupMobileMenuOutsideClick(navLinks, mobileMenuToggle);

  console.log('✓ Menu mobile initialisé');
}

function toggleMobileMenu(navLinks, mobileMenuToggle) {
  const isActive = navLinks.classList.contains('active');

  if (isActive) {
    closeMobileMenu(navLinks, mobileMenuToggle);
  } else {
    openMobileMenu(navLinks, mobileMenuToggle);
  }
}

function openMobileMenu(navLinks, mobileMenuToggle) {
  navLinks.classList.add('active');
  mobileMenuToggle.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu(navLinks, mobileMenuToggle) {
  navLinks.classList.remove('active');
  mobileMenuToggle.classList.remove('active');
  document.body.style.overflow = '';
}

function setupMobileMenuNavigation(navLinks, mobileMenuToggle) {
  const navItems = navLinks.querySelectorAll('a');
  navItems.forEach(item => {
    item.addEventListener('click', () => closeMobileMenu(navLinks, mobileMenuToggle));
  });
}

function setupMobileMenuOutsideClick(navLinks, mobileMenuToggle) {
  document.addEventListener('click', (event) => {
    const isOutsideClick = !navLinks.contains(event.target) &&
                          !mobileMenuToggle.contains(event.target);

    if (isOutsideClick && navLinks.classList.contains('active')) {
      closeMobileMenu(navLinks, mobileMenuToggle);
    }
  });
}

/**
 * Initialise le bouton de réduction/affichage du sommaire
 */
function initTOCToggle() {
  const tocToggleBtn = document.getElementById('toc-toggle-btn');
  const toc = document.getElementById('toc');

  if (!tocToggleBtn || !toc) return;

  // Charger l'état sauvegardé
  const savedState = localStorage.getItem('toc-collapsed');
  if (savedState === 'true') {
    toc.classList.add('collapsed');
    updateTOCToggleIcon(tocToggleBtn, true);
  }

  tocToggleBtn.addEventListener('click', () => {
    const isCollapsed = toc.classList.toggle('collapsed');
    updateTOCToggleIcon(tocToggleBtn, isCollapsed);

    // Sauvegarder l'état
    localStorage.setItem('toc-collapsed', isCollapsed.toString());
  });

  console.log('✓ Toggle TOC initialisé');
}

function updateTOCToggleIcon(button, isCollapsed) {
  const icon = button.querySelector('.toc-toggle-icon');
  if (icon) {
    icon.textContent = isCollapsed ? '+' : '−';
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Retourne l'emoji correspondant à une icône
 */
function getIconForAction(iconName) {
  return ICONS[iconName] || ICONS.default;
}

/**
 * Scroll animé vers une section avec adaptation au parallax horizontal
 */
function smoothScrollToSection(sectionSelector) {
  const section = $(sectionSelector);
  if (!section.length) return;

  const scrollWrapper = $('.horizontal-scroll-wrapper');
  const sectionIndex = $('.section').index(section);
  const scrollPosition = sectionIndex * (window.innerHeight * PARALLAX_SCROLL_MULTIPLIER);

  scrollWrapper.animate({
    scrollTop: scrollPosition
  }, SCROLL_ANIMATION_DURATION, 'swing');
}

// ============================================
// WINDOW RESIZE HANDLER
// ============================================

$(window).on('resize', () => {
  console.log('↔ Window resized');
});

// ============================================
// INITIALIZATION COMPLETE
// ============================================

console.log('✓ Grossophobie Script chargé et prêt');
