BEGIN;

-- Delete seeded farmer
DELETE FROM application_users WHERE email = 'farmer@deacomart.com';

-- Revert constraint to original values (excluding 'farmer')
ALTER TABLE application_users DROP CONSTRAINT IF EXISTS application_users_role_check;
ALTER TABLE application_users ADD CONSTRAINT application_users_role_check CHECK (role IN (
  'super_admin',
  'manager',
  'marketplace_manager',
  'finance_manager',
  'training_manager',
  'consultancy_manager',
  'logistics_manager',
  'content_manager',
  'support_officer'
));

DELETE FROM schema_migrations WHERE version = '006_allow_farmer_role';

COMMIT;
