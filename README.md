<div align="center">

# 🍃 MongoDB Ops Manager — Demo Interativa

**Simulação fiel e 100% interativa do MongoDB Ops Manager**, construída com a stack
oficial da MongoDB (**LeafyGreen Design System**) + backend Python.

Criada para apoiar a **MongoDB Brazil** no posicionamento do **MongoDB Enterprise Advanced**.

![stack](https://img.shields.io/badge/frontend-React%20%2B%20Vite%20%2B%20LeafyGreen-00ED64)
![backend](https://img.shields.io/badge/backend-FastAPI%20(Python)-001E2B)

</div>

---

## 🚀 Como rodar

```bash
./run-dev.sh        # ou, no terminal: opsmgr
```
Sobe o backend (FastAPI, porta 8077) + frontend (Vite/LeafyGreen, porta 5191) e abre o navegador.

> Primeira execução instala as dependências (npm + venv Python) automaticamente.

Detalhes de arquitetura, endpoints e execução manual: veja **[ARCHITECTURE.md](ARCHITECTURE.md)**.

---

## ✨ O que a demo cobre

Stack oficial MongoDB (LeafyGreen) com dados servidos por um backend FastAPI — as ações
produzem efeitos reais (provisionar cria, terminar remove, contadores atualizam).

| Módulo | Destaque |
|--------|----------|
| 🏠 **Dashboard** | Visão geral, alertas, status de clusters |
| 🗄️ **Deployments** | Replica Sets, Sharded, Standalone · Connect / Edit / Add Node / Upgrade / Step Down / Terminate |
| ⚙️ **Automation** | Pending changes (Apply/Discard) + histórico |
| 🤖 **Agents** | Lista + upgrade |
| 📊 **Metrics** | 8 gráficos dinâmicos por cluster |
| ⚡ **Performance Advisor** | Sugestões de índice + slow queries |
| ⏱️ **Real-Time** | Operações ao vivo (1s) |
| 💾 **Backup / Restore** | Snapshots + Point-in-Time Recovery |
| 🔔 **Alerts** | Open / Closed / Settings |
| 🔐 **Security** | Users, Roles (RBAC), Auth (SCRAM/x.509/LDAP/Kerberos/TLS), IP list, Audit Log |
| 📋 **Activity** · ⚙️ **Settings** | Feed de eventos + Reset Demo |

---

## 🧱 Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React + Vite + [@leafygreen-ui](https://www.mongodb.design/) (design system oficial) |
| HTTP | axios |
| Backend | Python FastAPI (estado em memória, sem banco real) |

## ⚠️ Aviso

Demonstração visual e educativa. Dados fictícios em memória — **sem conexão com bancos reais**.
MongoDB, Ops Manager e Enterprise Advanced são marcas da MongoDB, Inc.

---

<div align="center">

Feito com 💚 para a **MongoDB Brazil** · apoiando o **Enterprise Advanced**

</div>
