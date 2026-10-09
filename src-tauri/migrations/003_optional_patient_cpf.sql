-- Keep foreign_keys ON. Temporarily evacuate child rows so dropping the old
-- parent does not leave deferred FK counters for a table that no longer exists.
PRAGMA defer_foreign_keys=ON;
CREATE TEMP TABLE migration_patient_tags AS SELECT * FROM patient_tags;
CREATE TEMP TABLE migration_prescriptions AS SELECT * FROM prescriptions;
DELETE FROM patient_tags;
DELETE FROM prescriptions;
CREATE TABLE patients_new (
 internal_number INTEGER PRIMARY KEY AUTOINCREMENT CHECK(internal_number BETWEEN 1 AND 9007199254740991),
 id TEXT NOT NULL UNIQUE, cpf TEXT UNIQUE, search TEXT NOT NULL,
 payload TEXT NOT NULL, archived INTEGER NOT NULL DEFAULT 0 CHECK(archived IN (0,1)),
 created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
INSERT INTO patients_new(id,cpf,search,payload,archived,created_at,updated_at)
 SELECT id,cpf,search,payload,archived,created_at,updated_at FROM patients ORDER BY created_at,id;
DROP TABLE patients;
ALTER TABLE patients_new RENAME TO patients;
INSERT INTO prescriptions(id,patient_id,author_id,previous_id,version,status,payload,created_at,updated_at)
 SELECT id,patient_id,author_id,previous_id,version,status,payload,created_at,updated_at FROM migration_prescriptions;
INSERT INTO patient_tags(patient_id,tag_id)
 SELECT patient_id,tag_id FROM migration_patient_tags;
DROP TABLE migration_patient_tags;
DROP TABLE migration_prescriptions;
