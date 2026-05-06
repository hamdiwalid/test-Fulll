const Location = require('../../Domain/ValueObjects/Location');
const VehiclePlateNumber = require('../../Domain/ValueObjects/VehiclePlateNumber');

class ParkVehicleHandler {
  constructor(fleetRepository, vehicleRepository) {
    this.fleetRepository = fleetRepository;
    this.vehicleRepository = vehicleRepository;
  }

  async handle(command) {
    const fleet = await this.fleetRepository.findById(command.fleetId);
    if (!fleet) throw new Error('Fleet not found');

    const plate = new VehiclePlateNumber(command.plateNumber);
    if (!fleet.hasVehicle(plate)) {
      throw new Error('Vehicle is not registered in this fleet');
    }

    const vehicle = await this.vehicleRepository.findByPlate(plate);
    if (!vehicle) throw new Error('Vehicle not found');

    // Vehicle.parkAt lève une erreur si la position est identique à la précédente.
    const location = new Location(command.lat, command.lng, command.alt);
    vehicle.parkAt(location);

    await this.vehicleRepository.save(vehicle);
  }
}

module.exports = ParkVehicleHandler;
