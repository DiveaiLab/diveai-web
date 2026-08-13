CREATE TABLE IF NOT EXISTS admin_users (
  email TEXT PRIMARY KEY NOT NULL,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS content_types (
  key TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  default_slug_strategy TEXT NOT NULL DEFAULT 'timestamp' CHECK (default_slug_strategy IN ('timestamp', 'sequence', 'manual')),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS content_items (
  id TEXT PRIMARY KEY NOT NULL,
  content_type TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  slug_strategy TEXT NOT NULL DEFAULT 'timestamp' CHECK (slug_strategy IN ('timestamp', 'sequence', 'manual')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'confirmed', 'published')),
  finished_at TEXT,
  reviewed_at TEXT,
  published_at TEXT,
  author TEXT NOT NULL DEFAULT '',
  reviewer TEXT NOT NULL DEFAULT '',
  excerpt TEXT NOT NULL DEFAULT '',
  body_markdown TEXT NOT NULL DEFAULT '',
  cover_image_key TEXT,
  cover_image_alt TEXT NOT NULL DEFAULT '',
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_by_email TEXT NOT NULL DEFAULT '',
  updated_by_email TEXT NOT NULL DEFAULT '',
  FOREIGN KEY (content_type) REFERENCES content_types(key)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_content_items_type_slug
  ON content_items(content_type, slug);

CREATE INDEX IF NOT EXISTS idx_content_items_type_status_updated
  ON content_items(content_type, status, updated_at);

CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS content_tags (
  content_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY (content_id, tag_id),
  FOREIGN KEY (content_id) REFERENCES content_items(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS admin_assets (
  id TEXT PRIMARY KEY NOT NULL,
  r2_key TEXT NOT NULL UNIQUE,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  uploaded_by_email TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO content_types (
  key,
  name,
  description,
  default_slug_strategy,
  is_active
) VALUES (
  'ai_explainer_article',
  'AI 科普文章',
  'DiveAI 的 AI 科普文章內容',
  'timestamp',
  1
);
