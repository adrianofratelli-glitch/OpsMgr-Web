"""
Estado em memória do MongoDB Ops Manager (demo).
Espelha os dados da demo single-file original. Reinicia ao reiniciar o servidor.
"""
import copy


def seed():
    """Retorna uma cópia fresca do estado inicial (usado no reset)."""
    return copy.deepcopy(_SEED)


_SEED = {
    "org": "MongoDB Brazil",
    "project": "Production",
    "clusters": [
        {
            "id": "rs-prod-01", "type": "rs", "name": "rs-prod-01",
            "version": "7.0.5", "status": "warning",
            "nodes": [
                {"host": "mongo-node-01.mongodb-brazil.internal:27017", "role": "PRIMARY", "version": "7.0.5", "status": "green", "uptime": "14d 6h", "conn": 342, "disk": 62, "lag": "—"},
                {"host": "mongo-node-02.mongodb-brazil.internal:27017", "role": "SECONDARY", "version": "7.0.5", "status": "yellow", "uptime": "14d 6h", "conn": 201, "disk": 91, "lag": "0.8s"},
                {"host": "mongo-node-03.mongodb-brazil.internal:27017", "role": "SECONDARY", "version": "7.0.5", "status": "green", "uptime": "14d 6h", "conn": 198, "disk": 58, "lag": "0.2s"},
            ],
        },
        {
            "id": "sharded-analytics", "type": "sharded", "name": "sharded-analytics",
            "version": "7.0.5", "status": "healthy",
            "nodes": [
                {"host": "mongos-01.mongodb-brazil.internal:27017", "role": "mongos", "version": "7.0.5", "status": "green", "uptime": "30d", "conn": 520, "disk": 0, "lag": "—"},
                {"host": "shard-01-n1.mongodb-brazil.internal:27018", "role": "Shard PRIMARY", "version": "7.0.5", "status": "green", "uptime": "30d", "conn": 180, "disk": 45, "lag": "—"},
                {"host": "shard-02-n1.mongodb-brazil.internal:27018", "role": "Shard PRIMARY", "version": "7.0.5", "status": "green", "uptime": "30d", "conn": 165, "disk": 51, "lag": "—"},
                {"host": "configsvr-01.mongodb-brazil.internal:27019", "role": "Config Server", "version": "7.0.5", "status": "green", "uptime": "30d", "conn": 12, "disk": 18, "lag": "—"},
            ],
        },
        {
            "id": "rs-staging", "type": "rs", "name": "rs-staging",
            "version": "6.0.12", "status": "healthy",
            "nodes": [
                {"host": "stg-mongo-01.mongodb-brazil.internal:27017", "role": "PRIMARY", "version": "6.0.12", "status": "green", "uptime": "5d", "conn": 42, "disk": 22, "lag": "—"},
                {"host": "stg-mongo-02.mongodb-brazil.internal:27017", "role": "SECONDARY", "version": "6.0.12", "status": "green", "uptime": "5d", "conn": 38, "disk": 21, "lag": "0.1s"},
            ],
        },
        {
            "id": "mongo-dev-01", "type": "standalone", "name": "mongo-dev-01",
            "version": "7.0.5", "status": "healthy",
            "nodes": [
                {"host": "dev-mongo.mongodb-brazil.internal:27017", "role": "Standalone", "version": "7.0.5", "status": "green", "uptime": "2d", "conn": 8, "disk": 12, "lag": "—"},
            ],
        },
    ],
    "snapshots": [
        {"id": "snap-00142", "cluster": "rs-prod-01", "type": "Automated", "created": "2024-01-15 08:00", "size": "42 GB", "expires": "2024-02-14", "status": "ready"},
        {"id": "snap-00141", "cluster": "rs-prod-01", "type": "Automated", "created": "2024-01-15 02:00", "size": "41 GB", "expires": "2024-02-14", "status": "ready"},
        {"id": "snap-00140", "cluster": "rs-prod-01", "type": "Automated", "created": "2024-01-14 20:00", "size": "40 GB", "expires": "2024-02-13", "status": "ready"},
        {"id": "snap-00139", "cluster": "rs-prod-01", "type": "Manual", "created": "2024-01-14 14:00", "size": "40 GB", "expires": "2024-02-13", "status": "ready"},
        {"id": "snap-00138", "cluster": "sharded-analytics", "type": "Automated", "created": "2024-01-15 06:00", "size": "218 GB", "expires": "2024-01-29", "status": "ready"},
        {"id": "snap-00137", "cluster": "sharded-analytics", "type": "Automated", "created": "2024-01-14 18:00", "size": "215 GB", "expires": "2024-01-28", "status": "ready"},
        {"id": "snap-00136", "cluster": "rs-staging", "type": "Automated", "created": "2024-01-15 09:00", "size": "18 GB", "expires": "2024-01-22", "status": "ready"},
        {"id": "snap-00135", "cluster": "rs-staging", "type": "Automated", "created": "2024-01-14 21:00", "size": "17 GB", "expires": "2024-01-21", "status": "ready"},
    ],
    "snapshot_base": 100,  # offset para "Total Snapshots" (142 = len+? mantém realismo)
    "users": [
        {"name": "admin", "auth": "SCRAM-SHA-256", "roles": ["root@admin"], "db": "admin", "created": "2023-06-01", "status": "active"},
        {"name": "app_service", "auth": "SCRAM-SHA-256", "roles": ["readWrite@app_db"], "db": "app_db", "created": "2023-08-12", "status": "active"},
        {"name": "analytics_ro", "auth": "SCRAM-SHA-256", "roles": ["read@analytics"], "db": "analytics", "created": "2023-09-03", "status": "active"},
        {"name": "backup_user", "auth": "SCRAM-SHA-256", "roles": ["backup@admin"], "db": "admin", "created": "2023-06-15", "status": "active"},
        {"name": "monitor_svc", "auth": "x.509", "roles": ["clusterMonitor@admin"], "db": "$external", "created": "2023-07-20", "status": "active"},
        {"name": "legacy_app", "auth": "SCRAM-SHA-1", "roles": ["readWrite@legacy"], "db": "legacy", "created": "2022-12-01", "status": "disabled"},
    ],
    "roles": [
        {"name": "analyticsReadOnly", "priv": "find, listCollections, collStats", "inherits": "read", "users": 3},
        {"name": "appWriter", "priv": "find, insert, update, remove", "inherits": "readWrite", "users": 5},
        {"name": "indexManager", "priv": "createIndex, dropIndex, listIndexes", "inherits": "(none)", "users": 1},
    ],
    "alerts_open": [
        {"id": 1, "sev": "crit", "title": "Disk utilization above 90%", "target": "rs-prod-01 / mongo-node-02", "detail": "Current: 91% · Threshold: 90%", "time": "2 min ago"},
        {"id": 2, "sev": "warn", "title": "Replication lag above threshold", "target": "rs-prod-01 / mongo-node-02", "detail": "Current: 0.8s · Threshold: 0.5s", "time": "18 min ago"},
        {"id": 3, "sev": "warn", "title": "High connection count", "target": "sharded-analytics / mongos-01", "detail": "Current: 520 · Threshold: 500", "time": "1h ago"},
    ],
    "alerts_closed_count": 28,
    "alert_configs": [
        {"cond": "Host is down", "target": "All clusters", "thresh": "—", "notify": "Email, PagerDuty", "on": True},
        {"cond": "Disk space % used is above", "target": "All clusters", "thresh": "90%", "notify": "Email, Slack", "on": True},
        {"cond": "CPU utilization is above", "target": "rs-prod-01", "thresh": "85%", "notify": "Email", "on": True},
        {"cond": "Connections is above", "target": "All clusters", "thresh": "500", "notify": "Slack", "on": True},
        {"cond": "Replication lag is above", "target": "rs-prod-01", "thresh": "0.5s", "notify": "Email, PagerDuty", "on": True},
        {"cond": "Page faults is above", "target": "All clusters", "thresh": "100/s", "notify": "Email", "on": False},
    ],
    "pending_changes": [
        {"id": "pc-1", "cluster": "rs-prod-01", "type": "Version Upgrade", "desc": "7.0.5 → 7.0.6 (rolling upgrade)", "by": "admin@mongodb-brazil.com", "time": "30 min ago"},
        {"id": "pc-2", "cluster": "sharded-analytics", "type": "Config Change", "desc": "WiredTiger cache 4GB → 8GB", "by": "john.doe@mongodb-brazil.com", "time": "1h ago"},
    ],
    "automation_history": [
        {"time": "2024-01-15 10:42", "cluster": "rs-prod-01", "change": "Oplog size 5GB → 10GB", "status": "success", "duration": "4m 12s", "by": "admin"},
        {"time": "2024-01-14 22:10", "cluster": "rs-staging", "change": "Version upgrade 6.0.11 → 6.0.12", "status": "success", "duration": "12m 30s", "by": "System"},
        {"time": "2024-01-14 14:00", "cluster": "sharded-analytics", "change": "Added shard shard-02", "status": "success", "duration": "8m 05s", "by": "john.doe"},
        {"time": "2024-01-13 09:00", "cluster": "rs-prod-01", "change": "TLS certificate rotation", "status": "success", "duration": "6m 18s", "by": "admin"},
        {"time": "2024-01-12 16:30", "cluster": "rs-prod-01", "change": "Add hidden secondary node", "status": "failed", "duration": "2m 01s", "by": "admin"},
    ],
    "agents": [
        {"host": "mongo-node-01.mongodb-brazil.internal", "status": "Running", "version": "12.0.27", "type": "Automation + Monitoring + Backup", "ping": "5s ago", "cluster": "rs-prod-01"},
        {"host": "mongo-node-02.mongodb-brazil.internal", "status": "Running", "version": "12.0.27", "type": "Automation + Monitoring + Backup", "ping": "5s ago", "cluster": "rs-prod-01"},
        {"host": "mongo-node-03.mongodb-brazil.internal", "status": "Running", "version": "12.0.27", "type": "Automation + Monitoring + Backup", "ping": "7s ago", "cluster": "rs-prod-01"},
        {"host": "mongos-01.mongodb-brazil.internal", "status": "Running", "version": "12.0.27", "type": "Automation + Monitoring", "ping": "4s ago", "cluster": "sharded-analytics"},
        {"host": "shard-01-n1.mongodb-brazil.internal", "status": "Running", "version": "12.0.27", "type": "Automation + Monitoring + Backup", "ping": "6s ago", "cluster": "sharded-analytics"},
        {"host": "shard-02-n1.mongodb-brazil.internal", "status": "Running", "version": "12.0.27", "type": "Automation + Monitoring + Backup", "ping": "5s ago", "cluster": "sharded-analytics"},
        {"host": "configsvr-01.mongodb-brazil.internal", "status": "Running", "version": "12.0.27", "type": "Automation + Monitoring", "ping": "5s ago", "cluster": "sharded-analytics"},
        {"host": "stg-mongo-01.mongodb-brazil.internal", "status": "Running", "version": "12.0.27", "type": "Automation + Monitoring + Backup", "ping": "9s ago", "cluster": "rs-staging"},
        {"host": "stg-mongo-02.mongodb-brazil.internal", "status": "Running", "version": "12.0.27", "type": "Automation + Monitoring + Backup", "ping": "9s ago", "cluster": "rs-staging"},
        {"host": "dev-mongo.mongodb-brazil.internal", "status": "Running", "version": "12.0.27", "type": "Automation + Monitoring", "ping": "12s ago", "cluster": "mongo-dev-01"},
    ],
    "perf_index_suggestions": [
        {"impact": "high", "ns": "app_db.orders", "idx": "{ customerId: 1, createdAt: -1 }", "queries": 42, "improvement": "~95% faster (12,400 → 8 docs)"},
        {"impact": "high", "ns": "app_db.sessions", "idx": "{ userId: 1, expiresAt: 1 }", "queries": 38, "improvement": "~88% faster (COLLSCAN → IXSCAN)"},
        {"impact": "med", "ns": "analytics.events", "idx": "{ eventType: 1, timestamp: -1 }", "queries": 21, "improvement": "~70% faster"},
        {"impact": "med", "ns": "app_db.products", "idx": "{ category: 1, price: 1 }", "queries": 15, "improvement": "~60% faster (sort in memory removed)"},
    ],
    "perf_slow_queries": [
        {"ns": "app_db.orders", "shape": "{ customerId: ?, status: ? }", "time": "412ms", "count": 1240, "examined": "12,400", "idx": "COLLSCAN"},
        {"ns": "app_db.sessions", "shape": "{ userId: ? }", "time": "287ms", "count": 980, "examined": "8,900", "idx": "COLLSCAN"},
        {"ns": "analytics.events", "shape": "{ eventType: ?, timestamp: {$gt:?} }", "time": "196ms", "count": 540, "examined": "45,000", "idx": "timestamp_1"},
        {"ns": "app_db.products", "shape": "{ category: ? } sort { price: 1 }", "time": "154ms", "count": 310, "examined": "6,200", "idx": "category_1"},
        {"ns": "app_db.users", "shape": "{ email: ? }", "time": "98ms", "count": 2100, "examined": "1", "idx": "email_1 ✓"},
    ],
    "ip_access_list": [
        {"ip": "10.0.0.0/16", "comment": "Internal VPC", "added": "Jan 01"},
        {"ip": "203.0.113.42/32", "comment": "Office VPN gateway", "added": "Jan 05"},
        {"ip": "198.51.100.0/24", "comment": "Monitoring subnet", "added": "Jan 10"},
    ],
    "audit_events": [
        {"ts": "2024-01-15 10:42:18", "user": "admin@mongodb-brazil.com", "action": "createUser", "res": "app_db.app_service", "ip": "10.0.1.42", "result": "success"},
        {"ts": "2024-01-15 10:38:02", "user": "app_service", "action": "authenticate", "res": "app_db", "ip": "10.0.2.15", "result": "success"},
        {"ts": "2024-01-15 10:35:51", "user": "unknown", "action": "authenticate", "res": "admin", "ip": "203.0.113.99", "result": "fail"},
        {"ts": "2024-01-15 10:30:14", "user": "admin@mongodb-brazil.com", "action": "dropCollection", "res": "staging.temp_data", "ip": "10.0.1.42", "result": "success"},
        {"ts": "2024-01-15 10:22:40", "user": "analytics_ro", "action": "authCheck", "res": "analytics.events (find)", "ip": "10.0.2.88", "result": "success"},
        {"ts": "2024-01-15 10:18:33", "user": "analytics_ro", "action": "authCheck", "res": "app_db.users (find)", "ip": "10.0.2.88", "result": "fail"},
        {"ts": "2024-01-15 10:05:11", "user": "backup_user", "action": "authenticate", "res": "admin", "ip": "10.0.1.10", "result": "success"},
        {"ts": "2024-01-15 09:58:02", "user": "admin@mongodb-brazil.com", "action": "updateRole", "res": "admin.appWriter", "ip": "10.0.1.42", "result": "success"},
    ],
    "activity": [
        {"time": "2024-01-15 10:42", "user": "admin@mongodb-brazil.com", "action": "EDIT", "resource": "rs-prod-01", "details": "Changed oplog size to 10GB"},
        {"time": "2024-01-15 09:15", "user": "System", "action": "SNAPSHOT", "resource": "rs-prod-01", "details": "Automated snapshot completed (42GB)"},
        {"time": "2024-01-15 08:30", "user": "System", "action": "ALERT RESOLVED", "resource": "rs-prod-01", "details": "High connections alert auto-resolved"},
        {"time": "2024-01-15 07:00", "user": "john.doe@mongodb-brazil.com", "action": "CREATE", "resource": "sharded-analytics", "details": "Added shard: shard-03"},
        {"time": "2024-01-14 22:10", "user": "System", "action": "UPGRADE", "resource": "rs-staging", "details": "MongoDB upgraded 6.0.11 → 6.0.12"},
        {"time": "2024-01-14 18:00", "user": "admin@mongodb-brazil.com", "action": "USER CREATE", "resource": "Security", "details": "New user: app_readonly created"},
        {"time": "2024-01-14 14:20", "user": "admin@mongodb-brazil.com", "action": "BACKUP CONFIG", "resource": "rs-prod-01", "details": "Retention policy updated to 30 days"},
    ],
}
