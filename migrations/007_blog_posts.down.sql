BEGIN;

DROP INDEX IF EXISTS content_pages_slug_idx;

ALTER TABLE content_pages
DROP COLUMN IF EXISTS slug,
DROP COLUMN IF EXISTS excerpt,
DROP COLUMN IF EXISTS cover_image,
DROP COLUMN IF EXISTS published_at;

DELETE FROM schema_migrations WHERE version = '007_blog_posts';

COMMIT;
