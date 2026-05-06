const VehiclePlateNumber = require('../../Domain/ValueObjects/VehiclePlateNumber');

class GetVehicleLocationHandler {
  constructor(fleetRepository, vehicleRepository) {
    this.fleetRepository = fleetRepository;
    this.vehicleRepository = vehicleRepository;
  }

  async handle(query) {
    const fleet = await this.fleetRepository.findById(query.fleetId);
    if (!fleet) throw new Error('Fleet not found');

    const plate = new VehiclePlateNumber(query.plateNumber);
    if (!fleet.hasVehicle(plate)) {
      throw new Error('Vehicle is not registered in this fleet');
    }

    const vehicle = await this.vehicleRepository.findByPlate(plate);
    return vehicle ? vehicle.location : null;
  }
}

module.exports = GetVehicleLocationHandler;
