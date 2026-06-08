#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────
# MongoDB Ops Manager — Dev Launcher (backend FastAPI + frontend Vite/LeafyGreen)
# Sobe os dois servidores e abre o navegador.
# ───────────────────────────────────────────────────────────
set -e
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_PORT=8077
FRONTEND_PORT=5191

cleanup() {
  echo ""
  echo "🛑 Encerrando servidores..."
  kill $BACK_PID $FRONT_PID 2>/dev/null || true
  exit 0
}
trap cleanup INT

# ── Backend ──────────────────────────────────────────────
echo "🐍 Iniciando backend (FastAPI) na porta $BACKEND_PORT..."
cd "$ROOT/backend"
if [ ! -d ".venv" ]; then
  echo "   Criando venv e instalando deps (primeira vez)..."
  python3.13 -m venv .venv 2>/dev/null || python3 -m venv .venv
  ./.venv/bin/pip install -q -r requirements.txt
fi
lsof -ti tcp:$BACKEND_PORT | xargs kill -9 2>/dev/null || true
./.venv/bin/uvicorn main:app --port $BACKEND_PORT >/tmp/opsmgr-backend.log 2>&1 &
BACK_PID=$!

# ── Frontend ─────────────────────────────────────────────
echo "⚛️  Iniciando frontend (Vite + LeafyGreen) na porta $FRONTEND_PORT..."
cd "$ROOT/frontend"
if [ ! -d "node_modules" ]; then
  echo "   Instalando deps do npm (primeira vez, ~1 min)..."
  npm install
fi
lsof -ti tcp:$FRONTEND_PORT | xargs kill -9 2>/dev/null || true
npm run dev >/tmp/opsmgr-frontend.log 2>&1 &
FRONT_PID=$!

sleep 6
URL="http://localhost:$FRONTEND_PORT"
echo ""
echo "✅ Tudo no ar!"
echo "   Frontend:  $URL"
echo "   Backend:   http://localhost:$BACKEND_PORT/docs  (Swagger)"
echo ""
echo "   Pressione Ctrl+C para encerrar ambos."
command -v open >/dev/null && open "$URL" || (command -v xdg-open >/dev/null && xdg-open "$URL")

wait
