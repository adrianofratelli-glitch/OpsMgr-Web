"""
MongoDB Ops Manager — Demo Backend (FastAPI)
Estado em memória, sem banco real. Serve os dados para o frontend React/LeafyGreen.
Rode com:  uvicorn main:app --reload --port 8000
"""
import random
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

import data

app = FastAPI(title="MongoDB Ops Manager — Demo API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Estado global em memória ─────────────────────────────────
STATE = data.seed()


def find_cluster(cid: str):
    return next((c for c in STATE["clusters"] if c["id"] == cid), None)


# ── Modelos de request ───────────────────────────────────────
class NewCluster(BaseModel):
    name: str
    type: str  # "Replica Set" | "Sharded Cluster" | "Standalone"
    version: str = "7.0.5"
    members: int = 3
    port: str = "27017"


class NewNode(BaseModel):
    host: Optional[str] = None
    role: str = "Secondary"


class EditCluster(BaseModel):
    version: Optional[str] = None
    oplog: Optional[str] = None
    cache: Optional[str] = None
    log_level: Optional[str] = None


class UpgradeReq(BaseModel):
    target_version: str


class NewUser(BaseModel):
    name: str
    auth: str = "SCRAM-SHA-256"
    role: str = "read@analytics"


class NewRole(BaseModel):
    name: str
    priv: str = "find"
    inherits: str = "(none)"


class NewAlertConfig(BaseModel):
    cond: str
    thresh: str
    target: str
    notify: str = "Email"


class NewIP(BaseModel):
    ip: str
    comment: str = ""


# ════════════════════════════════════════════════════════════
# META / DASHBOARD
# ════════════════════════════════════════════════════════════
@app.get("/api/meta")
def get_meta():
    return {"org": STATE["org"], "project": STATE["project"]}


@app.get("/api/dashboard")
def get_dashboard():
    clusters = STATE["clusters"]
    total = len(clusters)
    healthy = sum(1 for c in clusters if c["status"] == "healthy")
    warn = sum(1 for c in clusters if c["status"] in ("warning", "critical"))
    hosts = sum(len(c["nodes"]) for c in clusters)
    return {
        "total_clusters": total,
        "healthy": healthy,
        "warning": warn,
        "hosts": hosts,
        "open_alerts": len(STATE["alerts_open"]),
        "snapshots": len(STATE["snapshots"]) + STATE["snapshot_base"],
        "clusters": clusters,
        "activity": STATE["activity"][:3],
    }


# ════════════════════════════════════════════════════════════
# CLUSTERS / DEPLOYMENTS
# ════════════════════════════════════════════════════════════
@app.get("/api/clusters")
def list_clusters():
    return STATE["clusters"]


@app.post("/api/clusters")
def create_cluster(req: NewCluster):
    if find_cluster(req.name):
        raise HTTPException(409, f'Cluster "{req.name}" já existe.')
    type_key = {"Replica Set": "rs", "Sharded Cluster": "sharded", "Standalone": "standalone"}.get(req.type, "rs")
    members = 1 if type_key == "standalone" else req.members
    nodes = []
    for i in range(members):
        role = "Standalone" if type_key == "standalone" else ("PRIMARY" if i == 0 else "SECONDARY")
        nodes.append({
            "host": f"{req.name}-node-0{i+1}.mongodb-brazil.internal:{req.port}",
            "role": role, "version": req.version, "status": "green",
            "uptime": "just now", "conn": 0, "disk": 5, "lag": "—" if i == 0 else "0.0s",
        })
    cluster = {"id": req.name, "type": type_key, "name": req.name, "version": req.version, "status": "healthy", "nodes": nodes}
    STATE["clusters"].append(cluster)
    _log_activity("admin@mongodb-brazil.com", "CREATE", req.name, f"Provisioned {req.type} with {members} node(s)")
    return cluster


@app.delete("/api/clusters/{cid}")
def delete_cluster(cid: str):
    c = find_cluster(cid)
    if not c:
        raise HTTPException(404, "Cluster não encontrado")
    STATE["clusters"].remove(c)
    _log_activity("admin@mongodb-brazil.com", "TERMINATE", cid, "Cluster terminated")
    return {"ok": True}


@app.put("/api/clusters/{cid}")
def edit_cluster(cid: str, req: EditCluster):
    c = find_cluster(cid)
    if not c:
        raise HTTPException(404, "Cluster não encontrado")
    if req.version:
        c["version"] = req.version
        for n in c["nodes"]:
            n["version"] = req.version
    _log_activity("admin@mongodb-brazil.com", "EDIT", cid, "Config applied via Automation")
    return c


@app.post("/api/clusters/{cid}/nodes")
def add_node(cid: str, req: NewNode):
    c = find_cluster(cid)
    if not c:
        raise HTTPException(404, "Cluster não encontrado")
    host = req.host or f"{c['name']}-node-0{len(c['nodes'])+1}.mongodb-brazil.internal:27017"
    c["nodes"].append({"host": host, "role": "SECONDARY", "version": c["version"], "status": "green", "uptime": "just now", "conn": 0, "disk": 3, "lag": "0.0s"})
    return c


@app.post("/api/clusters/{cid}/stepdown")
def step_down(cid: str, node_idx: int = 0):
    c = find_cluster(cid)
    if not c:
        raise HTTPException(404, "Cluster não encontrado")
    old = next((n for n in c["nodes"] if n["role"] == "PRIMARY"), None)
    new = next((n for i, n in enumerate(c["nodes"]) if i != node_idx and n["role"] == "SECONDARY"), None)
    if old:
        old["role"] = "SECONDARY"
    if new:
        new["role"] = "PRIMARY"
    return {"new_primary": new["host"] if new else None, "cluster": c}


@app.post("/api/clusters/{cid}/upgrade")
def upgrade_cluster(cid: str, req: UpgradeReq):
    c = find_cluster(cid)
    if not c:
        raise HTTPException(404, "Cluster não encontrado")
    c["version"] = req.target_version
    for n in c["nodes"]:
        n["version"] = req.target_version
    _log_activity("System", "UPGRADE", cid, f"Rolling upgrade to {req.target_version}")
    return c


# ════════════════════════════════════════════════════════════
# AUTOMATION / AGENTS
# ════════════════════════════════════════════════════════════
@app.get("/api/automation")
def get_automation():
    return {
        "agents_active": len(STATE["agents"]),
        "pending": STATE["pending_changes"],
        "history": STATE["automation_history"],
    }


@app.post("/api/automation/pending/{pid}/apply")
def apply_pending(pid: str):
    pc = next((p for p in STATE["pending_changes"] if p["id"] == pid), None)
    if not pc:
        raise HTTPException(404, "Mudança não encontrada")
    STATE["pending_changes"].remove(pc)
    STATE["automation_history"].insert(0, {
        "time": "agora", "cluster": pc["cluster"], "change": pc["desc"],
        "status": "success", "duration": f"{random.randint(2,9)}m {random.randint(0,59)}s", "by": "admin",
    })
    return {"ok": True, "pending": STATE["pending_changes"]}


@app.delete("/api/automation/pending/{pid}")
def discard_pending(pid: str):
    pc = next((p for p in STATE["pending_changes"] if p["id"] == pid), None)
    if not pc:
        raise HTTPException(404, "Mudança não encontrada")
    STATE["pending_changes"].remove(pc)
    return {"ok": True, "pending": STATE["pending_changes"]}


@app.get("/api/agents")
def get_agents():
    return {"agents": STATE["agents"], "version": "12.0.27", "latest": "12.0.28"}


@app.post("/api/agents/upgrade")
def upgrade_agents():
    for a in STATE["agents"]:
        a["version"] = "12.0.28"
    return {"ok": True}


# ════════════════════════════════════════════════════════════
# MONITORING / PERFORMANCE / REAL-TIME (gerados dinamicamente)
# ════════════════════════════════════════════════════════════
def _series(n, base, noise, mn=0):
    v = base
    out = []
    for _ in range(n):
        v += (random.random() - 0.5) * noise
        out.append(round(max(mn, v), 1))
    return out


@app.get("/api/metrics/{cid}")
def get_metrics(cid: str):
    c = find_cluster(cid)
    if not c:
        raise HTTPException(404, "Cluster não encontrado")
    n = 24
    cpu = [{"label": node["host"].split(":")[0].split(".")[0], "data": _series(n, 35 + random.random()*25, 12)} for node in c["nodes"]]
    secs = [node for node in c["nodes"] if "SECONDARY" in node["role"]]
    lag = [{"label": s["host"].split(":")[0].split(".")[0], "data": _series(n, 0.3, 0.4)} for s in secs]
    return {
        "cluster": c["name"], "node_count": len(c["nodes"]),
        "cpu": cpu,
        "memory": {"resident": _series(n, 12, 1.5), "virtual": _series(n, 24, 2)},
        "ops": {"query": _series(n, 1200, 200), "insert": _series(n, 380, 80), "update": _series(n, 140, 40), "delete": _series(n, 20, 8)},
        "connections": {"current": _series(n, 340, 40), "available": _series(n, 800, 20)},
        "iops": {"read": _series(n, 620, 120), "write": _series(n, 310, 80)},
        "network": {"in": _series(n, 12, 3), "out": _series(n, 8, 2)},
        "lag": lag,
        "cache": {"used": _series(n, 3.2, 0.3), "dirty": _series(n, 0.4, 0.15)},
    }


@app.get("/api/realtime/{cid}")
def get_realtime(cid: str):
    namespaces = ["app_db.orders", "app_db.sessions", "analytics.events", "app_db.products", "app_db.users"]
    ops = ["query", "insert", "update", "getmore", "command", "aggregate"]
    inprogress = [{"opid": random.randint(10000, 99999), "op": random.choice(ops), "ns": random.choice(namespaces), "secs": round(random.random()*2, 2)} for _ in range(random.randint(2, 5))]
    hottest = sorted([{"ns": ns, "ops": random.randint(50, 600)} for ns in namespaces], key=lambda x: -x["ops"])
    return {
        "ops_per_sec": random.randint(1500, 2200),
        "connections": random.randint(320, 380),
        "net_in": round(10 + random.random()*5, 1),
        "net_out": round(6 + random.random()*4, 1),
        "docs_per_sec": round(20 + random.random()*10, 1),
        "in_progress": inprogress,
        "hottest": hottest,
    }


@app.get("/api/perf-advisor")
def get_perf_advisor():
    return {
        "index_suggestions": STATE["perf_index_suggestions"],
        "slow_queries": STATE["perf_slow_queries"],
        "slow_count": 127,
        "avg_query_ms": 8.4,
        "collections_scanned": 42,
    }


@app.post("/api/perf-advisor/index/{idx}")
def create_index(idx: int):
    if 0 <= idx < len(STATE["perf_index_suggestions"]):
        removed = STATE["perf_index_suggestions"].pop(idx)
        return {"ok": True, "created": removed, "remaining": STATE["perf_index_suggestions"]}
    raise HTTPException(404, "Sugestão não encontrada")


# ════════════════════════════════════════════════════════════
# BACKUP / RESTORE
# ════════════════════════════════════════════════════════════
@app.get("/api/backup")
def get_backup():
    protected = sum(1 for c in STATE["clusters"] if c["type"] != "standalone")
    return {
        "protected": protected,
        "total_snapshots": len(STATE["snapshots"]) + STATE["snapshot_base"],
        "snapshots": STATE["snapshots"],
    }


@app.post("/api/backup/snapshot")
def take_snapshot(cluster: str):
    last_num = int(STATE["snapshots"][0]["id"].split("-")[1]) if STATE["snapshots"] else 142
    snap = {"id": f"snap-{str(last_num+1).zfill(5)}", "cluster": cluster, "type": "Manual", "created": "agora", "size": "42 GB", "expires": "2024-02-15", "status": "ready"}
    STATE["snapshots"].insert(0, snap)
    return snap


@app.delete("/api/backup/snapshot/{sid}")
def delete_snapshot(sid: str):
    s = next((x for x in STATE["snapshots"] if x["id"] == sid), None)
    if not s:
        raise HTTPException(404, "Snapshot não encontrado")
    STATE["snapshots"].remove(s)
    return {"ok": True}


# ════════════════════════════════════════════════════════════
# ALERTS
# ════════════════════════════════════════════════════════════
@app.get("/api/alerts")
def get_alerts():
    return {
        "open": STATE["alerts_open"],
        "closed_count": STATE["alerts_closed_count"],
        "configs": STATE["alert_configs"],
    }


@app.post("/api/alerts/{aid}/resolve")
def resolve_alert(aid: int):
    a = next((x for x in STATE["alerts_open"] if x["id"] == aid), None)
    if not a:
        raise HTTPException(404, "Alerta não encontrado")
    STATE["alerts_open"].remove(a)
    STATE["alerts_closed_count"] += 1
    return {"ok": True, "open": STATE["alerts_open"], "closed_count": STATE["alerts_closed_count"]}


@app.post("/api/alerts/configs")
def add_alert_config(req: NewAlertConfig):
    cfg = {"cond": req.cond, "target": req.target, "thresh": req.thresh, "notify": req.notify, "on": True}
    STATE["alert_configs"].insert(0, cfg)
    return cfg


@app.delete("/api/alerts/configs/{idx}")
def delete_alert_config(idx: int):
    if 0 <= idx < len(STATE["alert_configs"]):
        STATE["alert_configs"].pop(idx)
        return {"ok": True}
    raise HTTPException(404, "Config não encontrada")


# ════════════════════════════════════════════════════════════
# SECURITY
# ════════════════════════════════════════════════════════════
@app.get("/api/users")
def get_users():
    return STATE["users"]


@app.post("/api/users")
def add_user(req: NewUser):
    u = {"name": req.name, "auth": req.auth, "roles": [req.role], "db": req.role.split("@")[-1] if "@" in req.role else "admin", "created": "just now", "status": "active"}
    STATE["users"].insert(0, u)
    _log_activity("admin@mongodb-brazil.com", "USER CREATE", "Security", f"New user: {req.name}")
    return u


@app.delete("/api/users/{name}")
def delete_user(name: str):
    u = next((x for x in STATE["users"] if x["name"] == name), None)
    if not u:
        raise HTTPException(404, "Usuário não encontrado")
    STATE["users"].remove(u)
    return {"ok": True}


@app.get("/api/roles")
def get_roles():
    return STATE["roles"]


@app.post("/api/roles")
def add_role(req: NewRole):
    r = {"name": req.name, "priv": req.priv, "inherits": req.inherits, "users": 0}
    STATE["roles"].insert(0, r)
    return r


@app.delete("/api/roles/{idx}")
def delete_role(idx: int):
    if 0 <= idx < len(STATE["roles"]):
        STATE["roles"].pop(idx)
        return {"ok": True}
    raise HTTPException(404, "Role não encontrada")


@app.get("/api/security/ip")
def get_ips():
    return STATE["ip_access_list"]


@app.post("/api/security/ip")
def add_ip(req: NewIP):
    entry = {"ip": req.ip, "comment": req.comment or "—", "added": "just now"}
    STATE["ip_access_list"].append(entry)
    return entry


@app.delete("/api/security/ip/{idx}")
def delete_ip(idx: int):
    if 0 <= idx < len(STATE["ip_access_list"]):
        STATE["ip_access_list"].pop(idx)
        return {"ok": True}
    raise HTTPException(404, "IP não encontrado")


@app.get("/api/audit")
def get_audit():
    return STATE["audit_events"]


# ════════════════════════════════════════════════════════════
# ACTIVITY / RESET
# ════════════════════════════════════════════════════════════
@app.get("/api/activity")
def get_activity():
    return STATE["activity"]


def _log_activity(user, action, resource, details):
    STATE["activity"].insert(0, {"time": "agora", "user": user, "action": action, "resource": resource, "details": details})


@app.post("/api/reset")
def reset_demo():
    global STATE
    STATE = data.seed()
    return {"ok": True}


@app.get("/")
def root():
    return {"service": "MongoDB Ops Manager — Demo API", "docs": "/docs", "status": "ok"}
