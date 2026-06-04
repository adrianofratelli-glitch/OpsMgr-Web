<div align="center">

# 🍃 MongoDB Ops Manager — Demo Web Interativa

**Uma simulação fiel e 100% interativa do MongoDB Ops Manager, rodando inteiramente no navegador.**

Criada para apoiar o time da **MongoDB Brazil** no posicionamento da solução **MongoDB Enterprise Advanced** junto a clientes.

![status](https://img.shields.io/badge/status-pronto%20para%20demo-00ED64)
![stack](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS%20puro-001E2B)
![deps](https://img.shields.io/badge/depend%C3%AAncias-apenas%20Chart.js%20(CDN)-blue)

### 👉 [**Abrir a demo ao vivo**](https://adrianofratelli-glitch.github.io/OpsMgr-Web/) 👈

*Nenhuma instalação necessária — abre direto no navegador.*

</div>

---

## 🎯 Por que essa demo existe

O **Ops Manager** é um dos principais diferenciais do **MongoDB Enterprise Advanced** — mas mostrá-lo a um cliente normalmente exige uma infraestrutura provisionada (agents, hosts, clusters reais). Isso cria atrito numa conversa comercial ou num primeiro contato técnico.

Esta demo resolve esse problema: ela **reproduz a experiência visual e funcional do Ops Manager** sem precisar de nenhum backend. O cliente **clica, provisiona, faz upgrade, restaura backup, configura segurança** — e sente na prática o poder operacional da plataforma, em segundos, a partir de um único arquivo HTML.

> 💡 **Objetivo:** facilitar o discurso de valor do **Enterprise Advanced**, mostrando de forma tangível as capacidades de automação, monitoramento, backup e segurança que o Ops Manager entrega.

---

## ✨ O que a demo cobre

A interface simula um fluxo **real** do Ops Manager, com estado gerenciado em memória — as ações produzem efeitos visíveis de verdade (provisionar cria, terminar remove, etc.).

| Módulo | O que demonstra |
|--------|-----------------|
| 🏠 **Dashboard** | Visão geral dos clusters, alertas críticos, status de agents e backups |
| 🗄️ **Deployments** | Replica Sets, Sharded Clusters e Standalone — com nós, roles, versões, disco e lag |
| ⚙️ **Automation** | Pending changes com Apply/Discard, histórico de mudanças orquestradas |
| 🤖 **Agents** | Lista de Automation/Monitoring/Backup agents, versões e upgrade |
| 📊 **Monitoring** | 8 gráficos (Chart.js) com métricas ao vivo, abas dinâmicas por nó do cluster |
| 💾 **Backup & Restore** | Snapshots, políticas de retenção, **Point-in-Time Recovery** com timeline de oplog |
| 🔔 **Alerts** | Alertas abertos/fechados, thresholds configuráveis, múltiplos canais de notificação |
| ⚡ **Performance Advisor** | Sugestões automáticas de índice por impacto + análise de slow queries (criar índice anima o build) |
| ⏱️ **Real-Time Panel** | Operações ao vivo (ops/s, conexões, network), ops em progresso e hottest collections atualizando a cada segundo |
| 🔐 **Security** | Database Users, Custom Roles (RBAC), Autenticação (SCRAM/x.509/LDAP/Kerberos), TLS, Encryption at Rest, IP Access List |
| 📋 **Audit Log** | Eventos de autenticação, autorização e DDL filtráveis |
| 🔌 **Connect** | Connection string SRV, comando mongosh e snippets de 5 drivers (Node, Python, Java, C#, Go) |

### Recursos de UX
- 🌙 **Dark Mode** com preferência salva
- 🔍 **Busca global** (clusters, hosts, usuários, alertas, páginas) com navegação por teclado
- 🎬 **Tour guiado** (modo apresentador) — destaca recursos passo a passo, ideal para demos
- 💾 **Persistência** — o estado sobrevive a refreshs (localStorage); botão **Reset Demo** restaura o inicial
- 📱 **Responsivo** — funciona em telas menores com menu lateral retrátil

### Fluxos totalmente funcionais
- 🚀 **Provisionar cluster** → modal de progresso animado (contata agents → configura mongod → inicia replica set → habilita monitoring/backup) → cluster aparece no Dashboard
- ⬆️ **Rolling Upgrade** de versão, nó a nó, sem downtime
- ➕ **Add Node** com initial sync · 🔄 **Step Down** com eleição · ♻️ **Resync**
- 📸 **Snapshot** e **Restore** (snapshot ou point-in-time)
- 👤 Criar/remover **usuários, roles, IPs e alertas**

---

## 🚀 Como executar

Não precisa instalar nada. Há 4 formas:

### Opção 1 — Demo ao vivo (mais fácil) ⭐
Abra **[https://adrianofratelli-glitch.github.io/OpsMgr-Web/](https://adrianofratelli-glitch.github.io/OpsMgr-Web/)** no navegador. Pronto.

### Opção 2 — Abrir o arquivo local
Basta dar **duplo-clique** no arquivo `index.html`.

### Opção 3 — Servidor local
Garante que o Chart.js (via CDN) carregue corretamente:

```bash
# a partir da pasta do projeto
python3 -m http.server 4599
# depois abra no navegador:
# http://localhost:4599/index.html
```

### Opção 4 — Atalho de terminal (macOS/Linux)
O repositório inclui um launcher pronto:

```bash
./open-demo.sh
```

---

## 🧱 Arquitetura técnica

Projetado para ser **portátil e auto-contido** — um único arquivo, fácil de compartilhar por e-mail, Slack ou pen drive numa visita a cliente.

- **`index.html`** — toda a aplicação (HTML + CSS + JavaScript puro) em um só arquivo
- **Única dependência externa:** [Chart.js](https://www.chartjs.org/) via CDN (para os gráficos de monitoring)
- **Estado em memória:** arrays como `clusterStore`, `snapshotStore`, `usersStore` são a fonte de verdade; a UI re-renderiza a partir deles
- **Sem backend, sem build, sem `npm install`** — abre em qualquer navegador moderno

```
OpsMgr-Web/
├── index.html        ← a demo completa (interface + lógica)
├── open-demo.sh      ← atalho para subir servidor local e abrir no navegador
├── README.md         ← este arquivo
└── LICENSE
```

---

## 🎤 Dicas para apresentar a clientes

1. **Comece pelo Dashboard** — mostre o alerta crítico de disco e a visão consolidada dos clusters.
2. **Provisione um cluster ao vivo** (`+ New Deployment`) — o progresso animado impressiona e mostra a automação.
3. **Vá em Monitoring** — troque entre clusters e destaque que as métricas se adaptam à topologia (replica set vs. sharded vs. standalone).
4. **Demonstre o Point-in-Time Recovery** em Backup — um dos argumentos mais fortes do Enterprise Advanced.
5. **Feche em Security** — LDAP, x.509, Encryption at Rest e Audit Log mostram a robustez enterprise.

---

## ⚠️ Aviso

Esta é uma **demonstração visual e educativa**. Os dados são fictícios e simulados em memória — **não há conexão com nenhum banco de dados ou infraestrutura real**. O objetivo é ilustrar as capacidades do MongoDB Ops Manager para fins de apresentação comercial e técnica.

MongoDB, Ops Manager e Enterprise Advanced são marcas da MongoDB, Inc.

---

<div align="center">

Feito com 💚 para a **MongoDB Brazil** · apoiando o posicionamento do **Enterprise Advanced**

</div>
