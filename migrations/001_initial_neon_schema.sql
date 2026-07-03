BEGIN;

CREATE TABLE IF NOT EXISTS schema_migrations (
  version text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE farmers (
  id text PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL UNIQUE,
  district text NOT NULL,
  sector text,
  farm_name text NOT NULL,
  farm_size text,
  products text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('active','pending','suspended','rejected')),
  kyc_status text NOT NULL DEFAULT 'pending' CHECK (kyc_status IN ('verified','pending','failed')),
  registered_date date NOT NULL DEFAULT CURRENT_DATE,
  total_sales numeric(14,2) NOT NULL DEFAULT 0 CHECK (total_sales >= 0),
  trainings_attended integer NOT NULL DEFAULT 0 CHECK (trainings_attended >= 0),
  performance_score numeric(5,2) NOT NULL DEFAULT 0 CHECK (performance_score BETWEEN 0 AND 100),
  profile_image text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE buyers (
  id text PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('individual','hotel','restaurant','supermarket','institution')),
  phone text NOT NULL,
  email text NOT NULL UNIQUE,
  district text NOT NULL,
  total_orders integer NOT NULL DEFAULT 0 CHECK (total_orders >= 0),
  total_spent numeric(14,2) NOT NULL DEFAULT 0 CHECK (total_spent >= 0),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  join_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE staff (
  id text PRIMARY KEY,
  auth_user_id uuid UNIQUE,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('trainer','consultant','driver','admin','support')),
  department text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL UNIQUE,
  district text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','on_leave','inactive')),
  join_date date NOT NULL DEFAULT CURRENT_DATE,
  assigned_tasks integer NOT NULL DEFAULT 0 CHECK (assigned_tasks >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE products (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL DEFAULT '',
  farmer_id text REFERENCES farmers(id) ON UPDATE CASCADE ON DELETE SET NULL,
  farmer_name text NOT NULL DEFAULT '',
  farm_name text NOT NULL DEFAULT '',
  district text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  price numeric(14,2) NOT NULL CHECK (price >= 0),
  quantity numeric(14,3) NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  unit text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','pending','rejected','suspended','featured')),
  quality_status text NOT NULL DEFAULT 'standard' CHECK (quality_status IN ('certified_organic','quality_verified','food_safety_approved','standard')),
  organic_status boolean NOT NULL DEFAULT false,
  quality_verified boolean NOT NULL DEFAULT false,
  food_safety_status boolean NOT NULL DEFAULT false,
  harvest_date date,
  listed_date date NOT NULL DEFAULT CURRENT_DATE,
  image text NOT NULL DEFAULT '',
  rating numeric(2,1) NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  sales numeric(14,3) NOT NULL DEFAULT 0 CHECK (sales >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id text PRIMARY KEY,
  buyer_id text REFERENCES buyers(id) ON UPDATE CASCADE ON DELETE SET NULL,
  buyer_name text NOT NULL,
  farmer_id text REFERENCES farmers(id) ON UPDATE CASCADE ON DELETE SET NULL,
  farmer_name text NOT NULL,
  product_id text REFERENCES products(id) ON UPDATE CASCADE ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity numeric(14,3) NOT NULL CHECK (quantity > 0),
  unit text NOT NULL,
  total numeric(14,2) NOT NULL CHECK (total >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','processing','in_transit','delivered','cancelled')),
  payment_method text NOT NULL CHECK (payment_method IN ('mtn_momo','airtel_money','bank_transfer','card')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('paid','pending','failed','refunded')),
  order_date date NOT NULL DEFAULT CURRENT_DATE,
  delivery_date date,
  district text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (delivery_date IS NULL OR delivery_date >= order_date)
);

CREATE TABLE payments (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id text NOT NULL REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
  amount numeric(14,2) NOT NULL CHECK (amount >= 0),
  method text NOT NULL CHECK (method IN ('mtn_momo','airtel_money','bank_transfer','card')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('paid','pending','failed','refunded')),
  external_reference text UNIQUE,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE training_courses (
  id text PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  trainer text NOT NULL,
  trainer_id text REFERENCES staff(id) ON UPDATE CASCADE ON DELETE SET NULL,
  duration text NOT NULL,
  sessions integer NOT NULL DEFAULT 0 CHECK (sessions >= 0),
  participants integer NOT NULL DEFAULT 0 CHECK (participants >= 0),
  completion_rate numeric(5,2) NOT NULL DEFAULT 0 CHECK (completion_rate BETWEEN 0 AND 100),
  next_session text NOT NULL,
  district text NOT NULL,
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('active','upcoming','completed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE training_registrations (
  id text PRIMARY KEY,
  course_id text REFERENCES training_courses(id) ON UPDATE CASCADE ON DELETE SET NULL,
  course_title text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  district text NOT NULL,
  registered_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE consultancy_requests (
  id text PRIMARY KEY,
  client text NOT NULL,
  service text NOT NULL,
  consultant text NOT NULL,
  consultant_id text REFERENCES staff(id) ON UPDATE CASCADE ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','cancelled')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
  request_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date NOT NULL,
  invoice_amount numeric(14,2) NOT NULL DEFAULT 0 CHECK (invoice_amount >= 0),
  invoice_status text NOT NULL DEFAULT 'draft' CHECK (invoice_status IN ('draft','sent','paid','overdue')),
  district text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (due_date >= request_date)
);

CREATE TABLE consultancy_bookings (
  id text PRIMARY KEY,
  service_title text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  scale text NOT NULL,
  notes text NOT NULL DEFAULT '',
  booking_date date NOT NULL,
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','Confirmed','Completed','Cancelled')),
  booked_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE vehicles (
  id text PRIMARY KEY,
  plate text NOT NULL UNIQUE,
  type text NOT NULL,
  driver_id text REFERENCES staff(id) ON UPDATE CASCADE ON DELETE SET NULL,
  driver_name text NOT NULL,
  capacity text NOT NULL,
  status text NOT NULL CHECK (status IN ('active','maintenance','inactive')),
  last_maintenance date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE deliveries (
  id text PRIMARY KEY,
  order_id text NOT NULL REFERENCES orders(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  buyer_name text NOT NULL,
  farmer_name text NOT NULL,
  driver_id text REFERENCES staff(id) ON UPDATE CASCADE ON DELETE SET NULL,
  driver_name text NOT NULL,
  vehicle_id text REFERENCES vehicles(id) ON UPDATE CASCADE ON DELETE SET NULL,
  vehicle_plate text NOT NULL,
  pickup_district text NOT NULL,
  delivery_district text NOT NULL,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','picked_up','in_transit','delivered','failed')),
  scheduled_date date NOT NULL,
  actual_delivery date,
  distance text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE partners (
  id text PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('hotel','supermarket','cooperative','ngo','government')),
  district text NOT NULL,
  contact_person text NOT NULL,
  phone text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('active','pending','inactive')),
  since date NOT NULL DEFAULT CURRENT_DATE,
  total_orders integer NOT NULL DEFAULT 0 CHECK (total_orders >= 0),
  total_value numeric(14,2) NOT NULL DEFAULT 0 CHECK (total_value >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE partnership_applications (
  id text PRIMARY KEY,
  organization_name text NOT NULL,
  partner_type text NOT NULL,
  contact_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  details text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  applied_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);

CREATE TABLE fnb_categories (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL UNIQUE,
  icon text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE fnb_products (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_id bigint NOT NULL REFERENCES fnb_categories(id) ON UPDATE CASCADE ON DELETE CASCADE,
  name text NOT NULL,
  price numeric(14,2) NOT NULL CHECK (price >= 0),
  stock numeric(14,3) NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sold numeric(14,3) NOT NULL DEFAULT 0 CHECK (sold >= 0),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','low_stock','out_of_stock')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category_id, name)
);

CREATE TABLE whatsapp_orders (
  id text PRIMARY KEY,
  customer text NOT NULL,
  phone text NOT NULL,
  product text NOT NULL,
  amount numeric(14,2) NOT NULL CHECK (amount >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','delivered','cancelled')),
  ordered_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE content_pages (
  id text PRIMARY KEY,
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('page','blog','news','event','testimonial')),
  status text NOT NULL CHECK (status IN ('published','draft','upcoming','archived')),
  body text NOT NULL DEFAULT '',
  author text NOT NULL,
  last_updated date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE site_content (
  mode text PRIMARY KEY CHECK (mode IN ('published','draft')),
  services jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(services) = 'array'),
  team jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(team) = 'array'),
  partners jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(partners) = 'array'),
  contact jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(contact) = 'object'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE activity_feed (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  type text NOT NULL,
  message text NOT NULL,
  icon text NOT NULL DEFAULT '',
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX products_farmer_id_idx ON products(farmer_id);
CREATE INDEX products_category_status_idx ON products(category, status);
CREATE INDEX orders_buyer_id_idx ON orders(buyer_id);
CREATE INDEX orders_status_date_idx ON orders(status, order_date DESC);
CREATE INDEX payments_order_id_idx ON payments(order_id);
CREATE INDEX training_registrations_course_id_idx ON training_registrations(course_id);
CREATE INDEX deliveries_order_id_idx ON deliveries(order_id);
CREATE INDEX deliveries_status_date_idx ON deliveries(status, scheduled_date);
CREATE INDEX whatsapp_orders_status_date_idx ON whatsapp_orders(status, ordered_at DESC);

DO $$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'farmers','buyers','staff','products','orders','payments','training_courses',
    'consultancy_requests','vehicles','deliveries','partners','fnb_categories',
    'fnb_products','whatsapp_orders','content_pages','site_content'
  ]
  LOOP
    EXECUTE format(
      'CREATE TRIGGER %I_set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
      table_name, table_name
    );
  END LOOP;
END;
$$;

INSERT INTO schema_migrations(version) VALUES ('001_initial_neon_schema');

COMMIT;
