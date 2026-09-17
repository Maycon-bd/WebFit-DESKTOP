CREATE TABLE patients (
    id TEXT PRIMARY KEY NOT NULL,
    display_name TEXT NOT NULL CHECK (length(trim(display_name)) BETWEEN 1 AND 200),
    created_at_utc TEXT NOT NULL
) STRICT;

CREATE TABLE patient_notes (
    id TEXT PRIMARY KEY NOT NULL,
    patient_id TEXT NOT NULL,
    note TEXT NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
) STRICT;