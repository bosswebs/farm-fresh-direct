BEGIN;
DROP TABLE IF EXISTS team_members;
DELETE FROM schema_migrations WHERE version = '004_team_members';
COMMIT;
