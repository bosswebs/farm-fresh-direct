BEGIN;

ALTER TABLE team_members
DROP COLUMN IF EXISTS biography,
DROP COLUMN IF EXISTS phone,
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS social_media;

DELETE FROM schema_migrations WHERE version = '005_team_members_biography';

COMMIT;
