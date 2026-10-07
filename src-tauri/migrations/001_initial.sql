CREATE TABLE users (
 id TEXT PRIMARY KEY, name TEXT NOT NULL COLLATE NOCASE,
 role TEXT NOT NULL CHECK(role IN ('ADMIN','NUTRITIONIST')),
 password_hash TEXT NOT NULL, must_change INTEGER NOT NULL DEFAULT 0 CHECK(must_change IN (0,1)),
 profile TEXT NOT NULL DEFAULT '{}', active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1))
);
CREATE UNIQUE INDEX users_active_login ON users(name COLLATE NOCASE) WHERE active=1;
CREATE TABLE settings (name TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE patients (
 id TEXT PRIMARY KEY, cpf TEXT NOT NULL UNIQUE, search TEXT NOT NULL,
 payload TEXT NOT NULL, archived INTEGER NOT NULL DEFAULT 0 CHECK(archived IN (0,1)),
 created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE tags (id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE COLLATE NOCASE, active INTEGER NOT NULL DEFAULT 1);
CREATE TABLE patient_tags (patient_id TEXT NOT NULL REFERENCES patients(id), tag_id TEXT NOT NULL REFERENCES tags(id), PRIMARY KEY(patient_id,tag_id));
CREATE TABLE prescriptions (
 id TEXT PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id), author_id TEXT NOT NULL REFERENCES users(id),
 previous_id TEXT REFERENCES prescriptions(id), version INTEGER NOT NULL, status TEXT NOT NULL CHECK(status IN ('DRAFT','FINAL','SUPERSEDED','CANCELLED')),
 payload TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE drafts (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), kind TEXT NOT NULL, payload TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE audit (
 id TEXT PRIMARY KEY, actor_type TEXT NOT NULL CHECK(actor_type IN ('USER','SYSTEM','UNAUTHENTICATED')),
 user_id TEXT REFERENCES users(id), at TEXT NOT NULL, workspace TEXT NOT NULL DEFAULT 'HEALTH',
 action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT,
 result TEXT NOT NULL CHECK(result IN ('SUCCESS','FAILURE','DENIED')),
 CHECK ((actor_type='USER' AND user_id IS NOT NULL) OR (actor_type!='USER' AND user_id IS NULL))
);
CREATE INDEX audit_order ON audit(at DESC,id DESC);
CREATE INDEX prescription_patient ON prescriptions(patient_id,created_at DESC);
CREATE TRIGGER audit_no_update BEFORE UPDATE ON audit BEGIN SELECT RAISE(ABORT,'audit immutable'); END;
CREATE TRIGGER audit_no_delete BEFORE DELETE ON audit BEGIN SELECT RAISE(ABORT,'audit immutable'); END;
