use crate::{Error, Result};
use rusqlite::{params, Connection, OptionalExtension};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Notes {
    pub title: String,
    pub highlights: Vec<String>,
}

pub fn current() -> Result<Notes> {
    let notes: Notes = serde_json::from_str(include_str!("../../src/data/release-notes.json"))?;
    if notes.title.trim().is_empty()
        || notes.highlights.is_empty()
        || notes.highlights.iter().any(|text| text.trim().is_empty())
    {
        return Err(Error::internal());
    }
    Ok(notes)
}

// Both identifiers come from the authenticated user and compiled application.
// The WebView cannot mark another account or an arbitrary release as read.
fn key(user: &str, version: &str) -> String {
    format!("release-notes:v1:{user}:{version}")
}

pub fn is_seen(db: &Connection, user: &str, version: &str) -> Result<bool> {
    Ok(db
        .query_row(
            "SELECT value FROM settings WHERE name=?1",
            [key(user, version)],
            |r| r.get::<_, String>(0),
        )
        .optional()?
        .as_deref()
        == Some("seen"))
}

pub fn mark_seen(db: &Connection, user: &str, version: &str) -> Result<()> {
    db.execute("INSERT INTO settings(name,value) VALUES(?1,'seen') ON CONFLICT(name) DO UPDATE SET value='seen'",
               params![key(user, version)])?;
    Ok(())
}
