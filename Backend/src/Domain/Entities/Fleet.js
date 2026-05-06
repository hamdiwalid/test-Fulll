// Une flotte appartient à un utilisateur et contient une liste de plaques.
//
// Règles métier :
//   - Un même véhicule ne peut pas être enregistré deux fois dans la même flotte.
//   - Un même véhicule peut appartenir à plusieurs flottes
//     (chaque flotte garde juste la plaque, le véhicule lui-même
//      est stocké une seule fois côté VehicleRepository).
class Fleet {
  constructor(id, userId) {
    if (!id) throw new Error('Fleet id is required');
    if (!userId) throw new Error('userId is required');
    this.id = id;
    this.userId = userId;
    this.vehiclePlates = []; // string[]
  }

  hasVehicle(plateNumber) {
    return this.vehiclePlates.includes(plateNumber.value);
  }

  registerVehicle(vehicle) {
    if (this.hasVehicle(vehicle.plateNumber)) {
      throw new Error('Vehicle is already registered in this fleet');
    }
    this.vehiclePlates.push(vehicle.plateNumber.value);
  }
}

module.exports = Fleet;
