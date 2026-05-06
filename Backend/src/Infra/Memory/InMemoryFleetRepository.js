// Stockage des flottes en mémoire (Map id -> Fleet).
// Implémente le contrat attendu par les handlers : save, findById, findByUserId.
class InMemoryFleetRepository {
  constructor() {
    this.fleets = new Map(); // id -> Fleet
  }

  async save(fleet) {
    this.fleets.set(fleet.id, fleet);
  }

  async findById(id) {
    return this.fleets.get(id) || null;
  }

  async findByUserId(userId) {
    return [...this.fleets.values()].filter(f => f.userId === userId);
  }
}

module.exports = InMemoryFleetRepository;
