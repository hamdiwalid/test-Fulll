const Vehicle = require('../../Domain/Entities/Vehicle');
const VehiclePlateNumber = require('../../Domain/ValueObjects/VehiclePlateNumber');
const Location = require('../../Domain/ValueObjects/Location');

// Même contrat que InMemoryVehicleRepository, mais persiste dans PostgreSQL.
// La position est stockée directement sur la ligne du véhicule.
class PostgresVehicleRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async save(vehicle) {
    const loc = vehicle.location;
    await this.pool.query(
      `INSERT INTO vehicles (plate_number, lat, lng, alt)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (plate_number)
       DO UPDATE SET lat = EXCLUDED.lat, lng = EXCLUDED.lng, alt = EXCLUDED.alt`,
      [vehicle.plateNumber.value, loc?.lat ?? null, loc?.lng ?? null, loc?.alt ?? null]
    );
  }

  async findByPlate(plateNumber) {
    return this.findByPlateValue(plateNumber.value);
  }

  async findByPlateValue(plateValue) {
    const res = await this.pool.query(
      'SELECT plate_number, lat, lng, alt FROM vehicles WHERE plate_number = $1',
      [plateValue]
    );
    if (res.rowCount === 0) return null;

    const row = res.rows[0];
    const vehicle = new Vehicle(new VehiclePlateNumber(row.plate_number));
    if (row.lat !== null && row.lng !== null) {
      vehicle.location = new Location(
        Number(row.lat),
        Number(row.lng),
        row.alt !== null ? Number(row.alt) : null
      );
    }
    return vehicle;
  }
}

module.exports = PostgresVehicleRepository;
