INSERT INTO admin_users (
  email,
  display_name,
  role,
  is_active,
  password_hash,
  password_updated_at,
  created_at,
  updated_at
) VALUES (
  'test@test.com',
  'Initial Admin',
  'admin',
  1,
  'pbkdf2_sha256$210000$Q9cUHECKfavfP8vbOZKtoA$svpNgL1LY1FpoI411s_NwMHvKVJOHidFSTesKqvXhUU',
  datetime('now'),
  datetime('now'),
  datetime('now')
)
ON CONFLICT(email) DO UPDATE SET
  display_name = excluded.display_name,
  role = 'admin',
  is_active = 1,
  password_hash = excluded.password_hash,
  password_updated_at = excluded.password_updated_at,
  updated_at = excluded.updated_at;
