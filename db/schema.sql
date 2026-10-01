CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL CHECK (char_length(name) BETWEEN 20 AND 60),
  email CITEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  address VARCHAR(400) NOT NULL DEFAULT '' CHECK (char_length(address) <= 400),
  role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN','USER','OWNER')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email CITEXT NOT NULL UNIQUE,
  address VARCHAR(400) NOT NULL CHECK (char_length(address) <= 400),
  owner_id INTEGER UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ratings (
  id SERIAL PRIMARY KEY,
  store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(store_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_stores_name ON stores(name);
CREATE INDEX IF NOT EXISTS idx_stores_address ON stores(address);
CREATE INDEX IF NOT EXISTS idx_ratings_store ON ratings(store_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user ON ratings(user_id);
