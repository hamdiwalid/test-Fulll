// Stockage des véhicules en mémoire, indexés par plaque.
// Un véhicule existe une seule fois ; chaque flotte référence juste sa plaque.
class InMemoryVehicleRepository {
  constructor() {
    this.vehicles = new Map(); // plateValue -> Vehicle
  }

  async save(vehicle) {
    this.vehicles.set(vehicle.plateNumber.value, vehicle);
  }

  async findByPlate(plateNumber) {
    return this.vehicles.get(plateNumber.value) || null;
  }

  async findByPlateValue(plateValue) {
    return this.vehicles.get(plateValue) || null;
  }
}

module.exports = InMemoryVehicleRepository;
