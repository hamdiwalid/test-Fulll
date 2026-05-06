const VehiclePlateNumber = require('../ValueObjects/VehiclePlateNumber');

// Un véhicule, identifié par sa plaque.
// Mémorise sa dernière position connue.
class Vehicle {
  constructor(plateNumber) {
    if (!(plateNumber instanceof VehiclePlateNumber)) {
      throw new Error('plateNumber must be a VehiclePlateNumber');
    }
    this.plateNumber = plateNumber;
    this.location = null;
  }

  parkAt(location) {
    // Règle métier : on refuse deux fois la même position d'affilée.
    if (this.location && this.location.equals(location)) {
      throw new Error('Vehicle is already parked at this location');
    }
    this.location = location;
  }
}

module.exports = Vehicle;
