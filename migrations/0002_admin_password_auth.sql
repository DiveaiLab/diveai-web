ALTER TABLE admin_users ADD COLUMN password_hash TEXT;
ALTER TABLE admin_users ADD COLUMN password_updated_at TEXT;
ALTER TABLE admin_users ADD COLUMN last_login_at TEXT;

CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  revoked_at TEXT,
  FOREIGN KEY (email) REFERENCES admin_users(email) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_email
  ON admin_sessions(email);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_token_hash
  ON admin_sessions(token_hash);
