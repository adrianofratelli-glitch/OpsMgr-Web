#!/usr/bin/env bash
# ───────────────────────────────────────────────
# MongoDB Ops Manager — Demo Launcher
# Sobe um servidor local e abre a demo no navegador.
# Funciona a partir de qualquer pasta onde o repo for clonado.
# ───────────────────────────────────────────────
set -e

# Pasta onde este script está (independe de onde foi chamado)
DEMO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${PORT:-4599}"

cd "$DEMO_DIR"

# Se já houver algo na porta, encerra
lsof -ti tcp:"$PORT" 2>/dev/null | xargs kill -9 2>/dev/null || true

echo "🚀 Iniciando MongoDB Ops Manager Demo..."
echo "   Servindo em http://localhost:$PORT"

python3 -m http.server "$PORT" --directory "$DEMO_DIR" >/dev/null 2>&1 &
SERVER_PID=$!

sleep 1

# Abre no navegador (macOS: open / Linux: xdg-open)
URL="http://localhost:$PORT/index.html"
if command -v open >/dev/null 2>&1; then
  open "$URL"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL"
else
  echo "   Abra manualmente: $URL"
fi

echo "✅ Demo aberta no navegador!"
echo "   Pressione Ctrl+C para encerrar o servidor."

trap "kill $SERVER_PID 2>/dev/null; echo ''; echo '🛑 Servidor encerrado.'; exit 0" INT
wait $SERVER_PID
