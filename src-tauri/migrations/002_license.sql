CREATE TABLE license_state (
 singleton INTEGER PRIMARY KEY CHECK(singleton=1),
 installation_id TEXT NOT NULL UNIQUE,
 recipient TEXT NOT NULL,
 active_license_id TEXT,
 administrator_id TEXT REFERENCES users(id)
);
CREATE TABLE license_requests (
 id TEXT PRIMARY KEY,
 kind TEXT NOT NULL CHECK(kind IN ('INITIAL','TRANSFER_RECOVERY','TEMPORARY_SUPPORT','ADMIN_RECOVERY','RESET_CLINIC')),
 request TEXT NOT NULL,
 base_license_id TEXT
);
CREATE TABLE license_authorizations (
 id TEXT PRIMARY KEY,
 request_id TEXT NOT NULL UNIQUE REFERENCES license_requests(id),
 kind TEXT NOT NULL CHECK(kind IN ('INITIAL','TRANSFER_RECOVERY','TEMPORARY_SUPPORT','ADMIN_RECOVERY','RESET_CLINIC')),
 payload TEXT NOT NULL,
 consumed_at TEXT
);
