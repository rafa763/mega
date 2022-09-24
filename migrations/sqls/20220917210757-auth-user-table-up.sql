CREATE TABLE IF NOT EXISTS "users" (
  id VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL check (role in ('admin', 'mod', 'user')) DEFAULT 'user',
  status VARCHAR(255) NOT NULL check (status in ('active', 'pending', 'banned')) DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);