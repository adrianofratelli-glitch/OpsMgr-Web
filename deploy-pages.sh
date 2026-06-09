#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────
# Deploy do frontend (modo MOCK, estático) para o GitHub Pages.
# Build sem backend — dados embutidos no cliente (src/api/mock.js).
# Publica em https://adrianofratelli-glitch.github.io/OpsMgr-Web/
# ───────────────────────────────────────────────────────────
set -e
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_URL="https://github.com/adrianofratelli-glitch/OpsMgr-Web.git"
BASE="/OpsMgr-Web/"

cd "$ROOT/frontend"
echo "📦 Build estático (mock + base ${BASE})..."
VITE_USE_MOCK=1 VITE_BASE="$BASE" npm run build

echo "🚀 Publicando dist/ na branch gh-pages..."
touch dist/.nojekyll
cd dist
rm -rf .git
git init -q
git checkout -q -b gh-pages
git add -A
git -c user.email=adrianofratelli4@gmail.com -c user.name="Adriano Fratelli" commit -q -m "Deploy: Ops Manager LeafyGreen (mock estático)"
git push -q -f "$REPO_URL" gh-pages
rm -rf .git
cd "$ROOT"

echo ""
echo "✅ Publicado! Pode levar ~1 min para propagar."
echo "   https://adrianofratelli-glitch.github.io/OpsMgr-Web/"
