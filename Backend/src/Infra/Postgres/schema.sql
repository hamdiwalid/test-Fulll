-- Schéma PostgreSQL pour Fleet Management
CREATE TABLE IF NOT EXISTS fleets (
  id      UUID PRIMARY KEY,
  user_id TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS vehicles (
  plate_number TEXT PRIMARY KEY,
  lat          DOUBLE PRECISION,
  lng          DOUBLE PRECISION,
  alt          DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS fleet_vehicles (
  fleet_id     UUID NOT NULL REFERENCES fleets(id) ON DELETE CASCADE,
  plate_number TEXT NOT NULL REFERENCES vehicles(plate_number) ON DELETE CASCADE,
  PRIMARY KEY (fleet_id, plate_number)
);
