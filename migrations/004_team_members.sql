BEGIN;

CREATE TABLE team_members (
  id text PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  expertise text NOT NULL,
  image_url text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for ordering
CREATE INDEX team_members_display_order_idx ON team_members(display_order, created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER set_team_members_updated_at
BEFORE UPDATE ON team_members
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Insert initial team members to seed the database
INSERT INTO team_members (id, name, role, expertise, image_url, display_order) VALUES
('t-1', 'Dukuzumuremyi Eric', 'CEO', 'Agribusiness Expert', '/images/staff/DUKUZUMUREMYI Eric.jpeg', 1),
('t-2', 'Ahishakiye Claudine (Zoe)', 'Founder & MD', 'Business Strategy & Operations', NULL, 2),
('t-3', 'Turimaso Innocent', 'Accountant', 'Finance & Accounting', '/images/staff/Accountant - TURIMASO Innocent.jpeg', 3),
('t-4', 'Habimana Joseph', 'Business Developer', 'Business Development', '/images/staff/HABIMANA Jpseph.jpeg', 4),
('t-5', 'Niyonsaba Jeanclaude', 'Food Scientist', 'Food Safety & Quality', NULL, 5),
('t-6', 'Bosco', 'IT Manager', 'Technology & Systems', NULL, 6),
('t-7', 'Ngoboka Noel', 'IT Staff', 'IT Support', NULL, 7),
('t-8', 'TBD', 'Agronomist', 'Agricultural Advisory', NULL, 8);

INSERT INTO schema_migrations(version) VALUES ('004_team_members');

COMMIT;
