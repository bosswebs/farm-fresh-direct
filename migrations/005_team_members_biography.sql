BEGIN;

ALTER TABLE team_members
ADD COLUMN biography text,
ADD COLUMN phone text,
ADD COLUMN email text,
ADD COLUMN social_media text;

INSERT INTO schema_migrations(version) VALUES ('005_team_members_biography');

COMMIT;
