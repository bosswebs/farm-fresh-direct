BEGIN;

ALTER TABLE staff DROP CONSTRAINT IF EXISTS staff_role_check;
ALTER TABLE staff ADD CONSTRAINT staff_role_check CHECK (
  role IN ('trainer','consultant','driver','admin','support')
);

DELETE FROM schema_migrations WHERE version = '008_add_content_staff_role';

COMMIT;
