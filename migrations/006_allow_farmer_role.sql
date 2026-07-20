BEGIN;

-- Drop the old constraint
ALTER TABLE application_users DROP CONSTRAINT IF EXISTS application_users_role_check;

-- Add the updated constraint including 'farmer'
ALTER TABLE application_users ADD CONSTRAINT application_users_role_check CHECK (role IN (
  'super_admin',
  'manager',
  'marketplace_manager',
  'finance_manager',
  'training_manager',
  'consultancy_manager',
  'logistics_manager',
  'content_manager',
  'support_officer',
  'farmer'
));

-- Seed a default farmer user if it doesn't exist yet
INSERT INTO application_users (email, password_hash, display_name, role, status)
VALUES (
  'farmer@deacomart.com',
  crypt('Password12345!', gen_salt('bf', 12)),
  'Dukuzumuremyi Eric (Farmer)',
  'farmer',
  'active'
)
ON CONFLICT (email) DO UPDATE SET
  role = 'farmer',
  status = 'active',
  updated_at = now();

INSERT INTO schema_migrations(version) VALUES ('006_allow_farmer_role');

COMMIT;
