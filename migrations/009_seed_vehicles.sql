BEGIN;

INSERT INTO vehicles (id, plate, type, driver_name, capacity, status) VALUES
  ('VEH-001', 'RAB 483 A', 'Pickup Truck',    'TBD', '1,500 kg',  'active'),
  ('VEH-002', 'RAC 117 B', 'Refrigerated Van', 'TBD', '800 kg',   'active'),
  ('VEH-003', 'RAD 299 C', 'Motorcycle',       'TBD', '50 kg',    'maintenance')
ON CONFLICT (id) DO NOTHING;

INSERT INTO schema_migrations(version) VALUES ('009_seed_vehicles');

COMMIT;
