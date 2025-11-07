#!/bin/bash

# ============================================
# BUILD SCRIPT - Performance Optimization
# ============================================
# Minifie les fichiers CSS et JS pour la production
#
# Usage: ./build.sh
# Nécessite: npx (Node.js)

set -e # Arrêter en cas d'erreur

echo "🔨 Début de la minification..."
echo ""

# ============================================
# JAVASCRIPT
# ============================================

echo "📦 Minification du JavaScript..."
npx terser grossophobie-script.js \
  --compress \
  --mangle \
  --output grossophobie-script.min.js

# Vérifier la taille
ORIGINAL_JS=$(wc -c < grossophobie-script.js | tr -d ' ')
MINIFIED_JS=$(wc -c < grossophobie-script.min.js | tr -d ' ')
REDUCTION_JS=$((100 - (MINIFIED_JS * 100 / ORIGINAL_JS)))

echo "✓ JavaScript minifié :"
echo "  Original  : ${ORIGINAL_JS} octets"
echo "  Minifié   : ${MINIFIED_JS} octets"
echo "  Réduction : ${REDUCTION_JS}%"
echo ""

# ============================================
# CSS - THEME SOMBRE
# ============================================

echo "🎨 Minification du CSS (thème sombre)..."
npx csso-cli grossophobie-style.css \
  --output grossophobie-style.min.css

# Vérifier la taille
ORIGINAL_CSS=$(wc -c < grossophobie-style.css | tr -d ' ')
MINIFIED_CSS=$(wc -c < grossophobie-style.min.css | tr -d ' ')
REDUCTION_CSS=$((100 - (MINIFIED_CSS * 100 / ORIGINAL_CSS)))

echo "✓ CSS sombre minifié :"
echo "  Original  : ${ORIGINAL_CSS} octets"
echo "  Minifié   : ${MINIFIED_CSS} octets"
echo "  Réduction : ${REDUCTION_CSS}%"
echo ""

# ============================================
# CSS - THEME CLAIR
# ============================================

echo "🎨 Minification du CSS (thème clair)..."
npx csso-cli grossophobie-style-light.css \
  --output grossophobie-style-light.min.css

# Vérifier la taille
ORIGINAL_CSS_LIGHT=$(wc -c < grossophobie-style-light.css | tr -d ' ')
MINIFIED_CSS_LIGHT=$(wc -c < grossophobie-style-light.min.css | tr -d ' ')
REDUCTION_CSS_LIGHT=$((100 - (MINIFIED_CSS_LIGHT * 100 / ORIGINAL_CSS_LIGHT)))

echo "✓ CSS clair minifié :"
echo "  Original  : ${ORIGINAL_CSS_LIGHT} octets"
echo "  Minifié   : ${MINIFIED_CSS_LIGHT} octets"
echo "  Réduction : ${REDUCTION_CSS_LIGHT}%"
echo ""

# ============================================
# RESUME
# ============================================

TOTAL_ORIGINAL=$((ORIGINAL_JS + ORIGINAL_CSS + ORIGINAL_CSS_LIGHT))
TOTAL_MINIFIED=$((MINIFIED_JS + MINIFIED_CSS + MINIFIED_CSS_LIGHT))
TOTAL_SAVED=$((TOTAL_ORIGINAL - TOTAL_MINIFIED))
TOTAL_REDUCTION=$((100 - (TOTAL_MINIFIED * 100 / TOTAL_ORIGINAL)))

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Minification terminée avec succès !"
echo ""
echo "📊 Résumé :"
echo "  Total original : ${TOTAL_ORIGINAL} octets"
echo "  Total minifié  : ${TOTAL_MINIFIED} octets"
echo "  Total économisé: ${TOTAL_SAVED} octets"
echo "  Réduction totale: ${TOTAL_REDUCTION}%"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Pour utiliser en production, remplacez dans vos HTML :"
echo "   grossophobie-style.css → grossophobie-style.min.css"
echo "   grossophobie-script.js → grossophobie-script.min.js"
echo ""
