BEGIN;
DROP TABLE IF EXISTS activity_feed, site_content, content_pages, whatsapp_orders,
  fnb_products, fnb_categories, partnership_applications, partners, deliveries,
  vehicles, consultancy_bookings, consultancy_requests, training_registrations,
  training_courses, payments, orders, products, staff, buyers, farmers CASCADE;
DELETE FROM schema_migrations WHERE version = '001_initial_neon_schema';
DROP FUNCTION IF EXISTS set_updated_at();
COMMIT;
