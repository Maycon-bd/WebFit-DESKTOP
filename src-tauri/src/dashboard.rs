use crate::{Error, Result};
use chrono::{Datelike, Months, NaiveDate, Utc};
use rusqlite::{params, Connection};
use serde_json::{json, Value};

// Read one consistent snapshot; no patient identifiers or clinical payloads cross IPC.
pub fn summary(db: &mut Connection, months: u32, today: NaiveDate) -> Result<Value> {
    if !matches!(months, 6 | 12) {
        return Err(Error::validation("Escolha seis ou doze meses."));
    }
    let end = today
        .with_day(1)
        .ok_or_else(|| Error::validation("Data inválida."))?;
    let start = end - Months::new(months - 1);
    let after = end + Months::new(1);
    let tx = db.transaction()?;
    let (active, archived): (i64, i64) = tx.query_row(
        "SELECT count(CASE WHEN archived=0 THEN 1 END), count(CASE WHEN archived=1 THEN 1 END) FROM patients",
        [], |row| Ok((row.get(0)?, row.get(1)?)),
    )?;
    let (draft, finalized, superseded, cancelled): (i64, i64, i64, i64) = tx.query_row(
        "SELECT count(CASE WHEN status='DRAFT' THEN 1 END), count(CASE WHEN status='FINAL' THEN 1 END), count(CASE WHEN status='SUPERSEDED' THEN 1 END), count(CASE WHEN status='CANCELLED' THEN 1 END) FROM prescriptions",
        [], |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?)),
    )?;
    let counts = {
        let mut statement = tx.prepare("SELECT strftime('%Y-%m',created_at),count(*) FROM patients WHERE julianday(created_at)>=julianday(?1) AND julianday(created_at)<julianday(?2) GROUP BY strftime('%Y-%m',created_at)")?;
        let rows = statement
            .query_map(params![start.to_string(), after.to_string()], |row| {
                Ok((row.get::<_, String>(0)?, row.get::<_, i64>(1)?))
            })?
            .collect::<std::result::Result<std::collections::HashMap<_, _>, _>>()?;
        rows
    };
    let registrations: Vec<Value> = (0..months)
        .map(|offset| {
            let month = (start + Months::new(offset)).format("%Y-%m").to_string();
            json!({"count":counts.get(&month).copied().unwrap_or(0),"month":month})
        })
        .collect();
    tx.commit()?;
    Ok(json!({
        "patients":{"active":active,"archived":archived},
        "prescriptions":{"draft":draft,"finalized":finalized,"superseded":superseded,"cancelled":cancelled},
        "registrations":registrations,"generatedAt":Utc::now().to_rfc3339()
    }))
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn snapshot_counts_all_records_and_utc_month_boundaries_without_payloads() {
        let temp = tempfile::tempdir().unwrap();
        let mut db = crate::database::open(&temp.path().join("fixture.db"), &[7; 32]).unwrap();
        crate::database::migrate(&mut db).unwrap();
        db.execute(
            "INSERT INTO users(id,name,role,password_hash) VALUES('u','fixture','ADMIN','unused')",
            [],
        )
        .unwrap();
        for index in 0..205 {
            db.execute("INSERT INTO patients(id,search,payload,archived,created_at,updated_at) VALUES(?1,'fixture','{}',?2,?3,?3)", params![format!("p{index}"), i64::from(index < 5), "2026-10-09T12:00:00Z"]).unwrap();
        }
        // Offset crosses into the first included UTC month; future/end-exclusive excluded.
        for (id, date) in [
            ("boundary", "2026-04-30T22:00:00-03:00"),
            ("old", "2026-04-30T23:59:59Z"),
            ("future", "2026-11-01T00:00:00Z"),
        ] {
            db.execute("INSERT INTO patients(id,search,payload,created_at,updated_at) VALUES(?1,'fixture','{}',?2,?2)", params![id,date]).unwrap();
        }
        for (index, status) in ["DRAFT", "DRAFT", "FINAL", "SUPERSEDED", "CANCELLED"]
            .iter()
            .enumerate()
        {
            db.execute("INSERT INTO prescriptions(id,patient_id,author_id,version,status,payload,created_at,updated_at) VALUES(?1,'p0','u',1,?2,'{}','2026-10-09T00:00:00Z','2026-10-09T00:00:00Z')", params![format!("rx{index}"), status]).unwrap();
        }
        let today = NaiveDate::from_ymd_opt(2026, 10, 9).unwrap();
        let result = summary(&mut db, 6, today).unwrap();
        assert_eq!(result["patients"], json!({"active":203,"archived":5}));
        assert_eq!(
            result["prescriptions"],
            json!({"draft":2,"finalized":1,"superseded":1,"cancelled":1})
        );
        assert_eq!(
            result["registrations"][0],
            json!({"month":"2026-05","count":1})
        );
        assert_eq!(result["registrations"][1]["count"], 0);
        assert_eq!(result["registrations"][5]["count"], 205);
        assert!(!result.to_string().contains("payload"));
        assert!(!result.to_string().contains("p0"));
        let year = summary(&mut db, 12, today).unwrap();
        assert_eq!(year["registrations"][0]["month"], "2025-11");
        assert!(summary(&mut db, 0, today).is_err());
        crate::database::integrity(&db).unwrap();
    }
    #[test]
    fn empty_database_reports_zero_and_twelve_calendar_months() {
        let temp = tempfile::tempdir().unwrap();
        let mut db = crate::database::open(&temp.path().join("empty.db"), &[8; 32]).unwrap();
        crate::database::migrate(&mut db).unwrap();
        let result = summary(&mut db, 12, NaiveDate::from_ymd_opt(2026, 1, 1).unwrap()).unwrap();
        assert_eq!(result["patients"]["active"], 0);
        assert_eq!(result["prescriptions"]["draft"], 0);
        assert_eq!(result["registrations"][0]["month"], "2025-02");
        assert!(result["registrations"]
            .as_array()
            .unwrap()
            .iter()
            .all(|row| row["count"] == 0));
    }
}
