BEGIN;

ALTER TABLE content_pages
ADD COLUMN slug text,
ADD COLUMN excerpt text NOT NULL DEFAULT '',
ADD COLUMN cover_image text,
ADD COLUMN published_at timestamptz;

CREATE UNIQUE INDEX content_pages_slug_idx ON content_pages(slug) WHERE slug IS NOT NULL;

INSERT INTO schema_migrations(version) VALUES ('007_blog_posts');

COMMIT;
