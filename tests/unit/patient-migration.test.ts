import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

// Executes the real migration SQL with FKs enabled. SQLCipher/DPAPI coverage
// belongs to the Rust integration tests; this portable check is complementary.
const migration = (name: string) =>
  readFileSync(
    new URL(`../../src-tauri/migrations/${name}.sql`, import.meta.url),
    "utf8",
  );
function legacy() {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys=ON");
  db.exec(migration("001_initial"));
  db.exec(migration("002_license"));
  db.exec(`
    INSERT INTO users(id,name,role,password_hash) VALUES('author','Fixture','ADMIN','!disabled');
    INSERT INTO patients VALUES('b','52998224725','fixture','{"sex":"legado"}',1,'2020-01-02','2020-01-03');
    INSERT INTO patients VALUES('a','11144477735','fixture','{}',0,'2020-01-01','2020-01-01');
    INSERT INTO tags VALUES('tag','Fixture',1);
    INSERT INTO patient_tags VALUES('b','tag');
    INSERT INTO prescriptions VALUES('p1','b','author',NULL,1,'FINAL','{}','2020','2020');
    INSERT INTO prescriptions VALUES('p2','b','author','p1',2,'DRAFT','{}','2021','2021');
    PRAGMA user_version=2;
  `);
  return db;
}
test("WEBFIT-5: migration preserves UUIDs, children, legacy payload and assigns ordered numbers", () => {
  const db = legacy();
  try {
    const children = db
      .prepare("SELECT * FROM prescriptions ORDER BY id")
      .all();
    db.exec("BEGIN");
    db.exec(migration("003_optional_patient_cpf"));
    assert.deepEqual(db.prepare("PRAGMA foreign_key_check").all(), []);
    db.exec("PRAGMA user_version=3; COMMIT");
    assert.deepEqual(
      db.prepare("SELECT * FROM prescriptions ORDER BY id").all(),
      children,
    );
    assert.equal(
      db.prepare("SELECT count(*) AS n FROM patient_tags").get()!.n,
      1,
    );
    assert.equal(
      db.prepare("SELECT internal_number FROM patients WHERE id='a'").get()!
        .internal_number,
      1,
    );
    assert.equal(
      db.prepare("SELECT internal_number FROM patients WHERE id='b'").get()!
        .internal_number,
      2,
    );
    assert.equal(
      db.prepare("SELECT payload FROM patients WHERE id='b'").get()!.payload,
      '{"sex":"legado"}',
    );
    for (const id of ["c", "d"]) {
      db.prepare(
        "INSERT INTO patients(id,cpf,search,payload,created_at,updated_at) VALUES(?,NULL,'','{}','2022','2022')",
      ).run(id);
    }
    assert.equal(
      db.prepare("SELECT internal_number FROM patients WHERE id='d'").get()!
        .internal_number,
      4,
    );
    assert.throws(() =>
      db.exec(
        "INSERT INTO patients(id,cpf,search,payload,created_at,updated_at) VALUES('e','52998224725','','{}','','')",
      ),
    );
    db.exec("DELETE FROM patients WHERE id='d'");
    db.exec(
      "INSERT INTO patients(id,search,payload,created_at,updated_at) VALUES('f','','{}','','')",
    );
    assert.equal(
      db.prepare("SELECT internal_number FROM patients WHERE id='f'").get()!
        .internal_number,
      5,
    );
  } finally {
    db.close();
  }
});
test("WEBFIT-5: failed migration rolls back schema, data and child relationships", () => {
  const db = legacy();
  try {
    const before = db.prepare("SELECT * FROM patients ORDER BY id").all();
    db.exec("BEGIN");
    db.exec(migration("003_optional_patient_cpf"));
    db.exec("INSERT INTO patient_tags VALUES('missing','tag')");
    assert.throws(() => db.exec("COMMIT"));
    db.exec("ROLLBACK");
    assert.deepEqual(
      db.prepare("SELECT * FROM patients ORDER BY id").all(),
      before,
    );
    assert.deepEqual(db.prepare("PRAGMA foreign_key_check").all(), []);
    assert.equal(db.prepare("PRAGMA user_version").get()!.user_version, 2);
    assert.throws(() =>
      db.exec("INSERT INTO patients VALUES('empty',NULL,'','{}',0,'','')"),
    );
  } finally {
    db.close();
  }
});
