# MongoDB Ops Manager — Demo (React + LeafyGreen + FastAPI)

Migração da demo single-file para a stack oficial da MongoDB (**LeafyGreen Design System**)
com backend Python.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React + Vite + [@leafygreen-ui](https://www.mongodb.design/) (design system oficial da MongoDB) |
| **Gráficos** | @lg-charts/core (charts oficiais MongoDB) |
| **HTTP** | axios |
| **Backend** | Python FastAPI (estado em memória, sem banco real) |

## Como rodar (local)

### Opção rápida — script único
```bash
./run-dev.sh
```
Sobe backend (porta 8077) + frontend (porta 5191) e abre o navegador.

### Manual
```bash
# Terminal 1 — backend
cd backend
python3.13 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --port 8077      # Swagger em http://localhost:8077/docs

# Terminal 2 — frontend
cd frontend
npm install
npm run dev                        # http://localhost:5191
```
O Vite faz proxy de `/api` → backend (porta 8077) automaticamente em dev.

## Estrutura

```
backend/
  main.py            # FastAPI — endpoints REST + mutações
  data.py            # estado-semente em memória (clusters, snapshots, users…)
  requirements.txt
frontend/
  src/
    api/client.js    # camada axios (todos os endpoints tipados)
    components/       # TopBar, Sidebar, MongoLeaf, ui helpers
    pages/            # Dashboard (+ demais seções, em migração)
    lib/sections.js   # config da navegação
    App.jsx           # shell: LeafyGreenProvider, dark mode, toast, roteamento
```

## Endpoints principais (backend)

`GET /api/dashboard` · `GET/POST/DELETE /api/clusters` · `GET /api/automation` ·
`GET /api/metrics/{id}` · `GET /api/perf-advisor` · `GET /api/backup` ·
`GET /api/alerts` · `GET /api/users` · `POST /api/reset` … (ver `/docs`).

## Status da migração

- [x] Backend FastAPI completo (todos os dados + mutações + reset)
- [x] Shell LeafyGreen (SideNav oficial, TopBar, dark mode, toast, axios)
- [x] Dashboard ligado ao backend
- [ ] Deployments, Automation, Monitoring, Backup, Alerts, Security… (em migração)

> A demo single-file original (`index.html`) segue funcional e publicada no GitHub Pages
> até a versão React estar completa.
