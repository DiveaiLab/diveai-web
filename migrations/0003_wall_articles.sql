-- 共學牆文章資料表，跟 feat-cms 分支共用同一個 D1 資料庫（web-prod），表名
-- 加 wall_ 前綴避免跟他們的 content_items／tags 等表混在一起分不清楚。
--
-- id 用文字（例如 wall_xxxxxxxx），不是自動遞增數字，對齊 feat-cms 那邊
-- content_items.id 的做法（lib/admin/http.ts 的 createId() 產生）。
-- links／scene／tech_tags 這三個欄位是 JSON 字串（SQLite 沒有陣列型別），
-- 讀寫時由 app/lib/wall/wall-state-context.tsx 負責 JSON.parse／stringify。
create table if not exists wall_articles (
  id text primary key not null,
  kind text not null check (kind in ('project', 'note', 'agent')),
  title text not null,
  body_md text not null default '',
  cover_url text not null default '',
  links text not null default '[]',      -- JSON: [{ "label": "...", "url": "..." }]
  scene text not null default '[]',      -- JSON: ["課業", "實習", ...]
  tech_tags text not null default '[]',  -- JSON: ["LLM", "RAG", ...]
  author_name text not null default '',
  author_avatar_url text not null default '',
  like_count integer not null default 0,
  status text not null check (status in ('draft', 'published')) default 'draft',
  created_at text not null,
  updated_at text not null default (datetime('now'))
);

create index if not exists idx_wall_articles_status_created_at
  on wall_articles (status, created_at desc);
