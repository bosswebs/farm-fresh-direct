BEGIN;

CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE application_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email citext NOT NULL UNIQUE,
  password_hash text NOT NULL,
  display_name text NOT NULL,
  role text NOT NULL CHECK (role IN (
    'super_admin',
    'manager',
    'marketplace_manager',
    'finance_manager',
    'training_manager',
    'consultancy_manager',
    'logistics_manager',
    'content_manager',
    'support_officer'
  )),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','disabled')),
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER application_users_set_updated_at
BEFORE UPDATE ON application_users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

INSERT INTO schema_migrations(version) VALUES ('002_application_users');

COMMIT;
