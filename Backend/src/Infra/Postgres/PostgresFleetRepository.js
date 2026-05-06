const Fleet = require('../../Domain/Entities/Fleet');

// Même contrat que InMemoryFleetRepository, mais persiste dans PostgreSQL.
// On garde tout dans une transaction lors du save pour rester cohérent.
class PostgresFleetRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async save(fleet) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(
        `INSERT INTO fleets (id, user_id)
         VALUES ($1, $2)
         ON CONFLICT (id) DO UPDATE SET user_id = EXCLUDED.user_id`,
        [fleet.id, fleet.userId]
      );

      // Approche simple : on remplace la liste des plaques de la flotte.
      // Suffisant tant que les flottes ne grossissent pas énormément.
      await client.query('DELETE FROM fleet_vehicles WHERE fleet_id = $1', [fleet.id]);
      for (const plate of fleet.vehiclePlates) {
        await client.query(
          `INSERT INTO fleet_vehicles (fleet_id, plate_number) VALUES ($1, $2)`,
          [fleet.id, plate]
        );
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async findById(id) {
    const fleetRes = await this.pool.query(
      'SELECT id, user_id FROM fleets WHERE id = $1',
      [id]
    );
    if (fleetRes.rowCount === 0) return null;

    const row = fleetRes.rows[0];
    const fleet = new Fleet(row.id, row.user_id);

    const platesRes = await this.pool.query(
      'SELECT plate_number FROM fleet_vehicles WHERE fleet_id = $1',
      [id]
    );
    fleet.vehiclePlates = platesRes.rows.map(r => r.plate_number);
    return fleet;
  }

  async findByUserId(userId) {
    const res = await this.pool.query(
      'SELECT id FROM fleets WHERE user_id = $1',
      [userId]
    );
    const fleets = [];
    for (const row of res.rows) {
      fleets.push(await this.findById(row.id));
    }
    return fleets;
  }
}

module.exports = PostgresFleetRepository;
