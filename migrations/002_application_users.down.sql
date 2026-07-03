BEGIN;
DROP TABLE IF EXISTS application_users;
DELETE FROM schema_migrations WHERE version = '002_application_users';
COMMIT;
