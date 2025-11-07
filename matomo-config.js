// ============================================
// MATOMO ANALYTICS CONFIGURATION
// ============================================
// Configuration RGPD-compliant pour Matomo Analytics
//
// Instructions :
// 1. Créez un compte Matomo (https://matomo.org/) ou utilisez une instance self-hosted
// 2. Remplacez YOUR_MATOMO_URL et YOUR_SITE_ID ci-dessous
// 3. Décommentez le code pour activer l'analytics
//
// Fonctionnalités RGPD :
// - Anonymisation des IP activée
// - Respect du Do Not Track
// - Opt-out widget disponible
// - Pas de cookies tiers
// - Données hébergées en Europe (selon votre instance)

// Configuration Matomo
const MATOMO_CONFIG = {
  enabled: false, // Changer à true pour activer
  url: 'YOUR_MATOMO_URL', // Ex: 'https://analytics.example.com/'
  siteId: 'YOUR_SITE_ID', // Ex: '1'

  // Options RGPD
  respectDoNotTrack: true,
  anonymizeIp: true,
  cookieDomain: 'p.newsforge.app',
  cookiePath: '/',
  cookieSameSite: 'Lax',

  // Options de tracking
  trackPageView: true,
  enableLinkTracking: true,
  enableHeartBeatTimer: true,
  heartBeatDelay: 15 // secondes
};

// ============================================
// INITIALIZATION
// ============================================

function initMatomo() {
  if (!MATOMO_CONFIG.enabled) {
    console.log('ℹ️ Matomo analytics désactivé');
    return;
  }

  // Vérifier que la configuration est complète
  if (MATOMO_CONFIG.url === 'YOUR_MATOMO_URL' || MATOMO_CONFIG.siteId === 'YOUR_SITE_ID') {
    console.warn('⚠️ Matomo non configuré. Veuillez remplir matomo-config.js');
    return;
  }

  var _paq = window._paq = window._paq || [];

  // Configuration RGPD
  if (MATOMO_CONFIG.respectDoNotTrack) {
    _paq.push(['setDoNotTrack', true]);
  }

  if (MATOMO_CONFIG.anonymizeIp) {
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);

    // Anonymisation des IP (masque les 2 derniers octets)
    _paq.push(['setTrackerUrl', MATOMO_CONFIG.url + 'matomo.php']);
    _paq.push(['setSiteId', MATOMO_CONFIG.siteId]);

    // Configuration des cookies
    _paq.push(['setCookieDomain', MATOMO_CONFIG.cookieDomain]);
    _paq.push(['setCookiePath', MATOMO_CONFIG.cookiePath]);
    _paq.push(['setCookieSameSite', MATOMO_CONFIG.cookieSameSite]);

    // Désactiver les cookies si l'utilisateur refuse
    if (localStorage.getItem('matomo-opt-out') === 'true') {
      _paq.push(['optUserOut']);
      console.log('🛡️ Matomo opt-out activé');
    }
  }

  if (MATOMO_CONFIG.enableHeartBeatTimer) {
    _paq.push(['enableHeartBeatTimer', MATOMO_CONFIG.heartBeatDelay]);
  }

  // Charger le script Matomo de manière asynchrone
  (function() {
    var u = MATOMO_CONFIG.url;
    var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
    g.async = true;
    g.src = u + 'matomo.js';
    s.parentNode.insertBefore(g, s);
  })();

  console.log('✓ Matomo analytics initialisé');
}

// ============================================
// CUSTOM EVENT TRACKING
// ============================================

/**
 * Track un événement personnalisé
 * @param {string} category - Catégorie de l'événement (ex: 'Pétition', 'Navigation')
 * @param {string} action - Action effectuée (ex: 'Clic', 'Scroll')
 * @param {string} name - Nom de l'événement (ex: 'Badge flottant')
 * @param {number} value - Valeur optionnelle
 */
function trackEvent(category, action, name, value) {
  if (!MATOMO_CONFIG.enabled) return;

  var _paq = window._paq = window._paq || [];
  if (value !== undefined) {
    _paq.push(['trackEvent', category, action, name, value]);
  } else {
    _paq.push(['trackEvent', category, action, name]);
  }

  console.log(`📊 Event tracked: ${category} > ${action} > ${name}`);
}

/**
 * Track une vue de section
 * @param {string} sectionName - Nom de la section
 */
function trackSectionView(sectionName) {
  if (!MATOMO_CONFIG.enabled) return;

  var _paq = window._paq = window._paq || [];
  _paq.push(['trackEvent', 'Navigation', 'Section vue', sectionName]);

  console.log(`📊 Section vue: ${sectionName}`);
}

/**
 * Track un clic sur la pétition
 * @param {string} location - Emplacement du clic (ex: 'Hero', 'Badge', 'Modal')
 */
function trackPetitionClick(location) {
  trackEvent('Pétition', 'Clic', location);
}

/**
 * Track l'activation du mode sensible
 */
function trackSafeModeActivation() {
  trackEvent('Sécurité', 'Activation', 'Mode sensible');
}

/**
 * Track le changement de thème
 * @param {string} theme - 'dark' ou 'light'
 */
function trackThemeChange(theme) {
  trackEvent('Interface', 'Changement thème', theme);
}

// ============================================
// OPT-OUT WIDGET
// ============================================

/**
 * Affiche le widget d'opt-out Matomo
 * @param {string} containerId - ID du conteneur HTML
 */
function displayMatomoOptOut(containerId) {
  if (!MATOMO_CONFIG.enabled) {
    document.getElementById(containerId).innerHTML =
      '<p>Analytics désactivé. Aucun tracking n\'est effectué.</p>';
    return;
  }

  const isOptedOut = localStorage.getItem('matomo-opt-out') === 'true';

  const html = `
    <div class="matomo-opt-out">
      <h3>🔒 Respect de votre vie privée</h3>
      <p>Nous utilisons Matomo Analytics pour mesurer l'audience de manière respectueuse :</p>
      <ul>
        <li>✅ Anonymisation complète des adresses IP</li>
        <li>✅ Respect du "Do Not Track"</li>
        <li>✅ Données hébergées en Europe</li>
        <li>✅ Pas de partage avec des tiers</li>
        <li>✅ Conformité RGPD</li>
      </ul>

      <div class="opt-out-status">
        <p><strong>Statut actuel :</strong>
          ${isOptedOut
            ? '<span style="color: var(--success-color);">✓ Vous avez refusé le tracking</span>'
            : '<span style="color: var(--primary-color);">✓ Le tracking est activé</span>'
          }
        </p>
        <button id="matomo-toggle-opt-out" class="btn-secondary">
          ${isOptedOut ? 'Activer le tracking' : 'Refuser le tracking'}
        </button>
      </div>
    </div>
  `;

  document.getElementById(containerId).innerHTML = html;

  // Event listener pour le bouton
  document.getElementById('matomo-toggle-opt-out').addEventListener('click', function() {
    const newOptOutStatus = !isOptedOut;
    localStorage.setItem('matomo-opt-out', newOptOutStatus.toString());

    if (newOptOutStatus) {
      window._paq = window._paq || [];
      window._paq.push(['optUserOut']);
      alert('✓ Tracking Matomo désactivé. Rechargez la page pour appliquer les changements.');
    } else {
      localStorage.removeItem('matomo-opt-out');
      alert('✓ Tracking Matomo activé. Rechargez la page pour appliquer les changements.');
    }

    location.reload();
  });
}

// ============================================
// AUTO-INITIALIZATION
// ============================================

// Initialiser Matomo au chargement de la page
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMatomo);
} else {
  initMatomo();
}

// Export pour usage dans d'autres scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initMatomo,
    trackEvent,
    trackSectionView,
    trackPetitionClick,
    trackSafeModeActivation,
    trackThemeChange,
    displayMatomoOptOut
  };
}
