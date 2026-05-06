const Vehicle = require('../../Domain/Entities/Vehicle');
const VehiclePlateNumber = require('../../Domain/ValueObjects/VehiclePlateNumber');

class RegisterVehicleHandler {
  constructor(fleetRepository, vehicleRepository) {
    this.fleetRepository = fleetRepository;
    this.vehicleRepository = vehicleRepository;
  }

  async handle(command) {
    const fleet = await this.fleetRepository.findById(command.fleetId);
    if (!fleet) throw new Error('Fleet not found');

    const plate = new VehiclePlateNumber(command.plateNumber);

    // Si le véhicule existe déjà (éventuellement dans une autre flotte),
    // on le réutilise. Sinon on le crée.
    let vehicle = await this.vehicleRepository.findByPlate(plate);
    if (!vehicle) {
      vehicle = new Vehicle(plate);
      await this.vehicleRepository.save(vehicle);
    }

    // L'entité Fleet lève une erreur si le véhicule est déjà dans cette flotte.
    fleet.registerVehicle(vehicle);
    await this.fleetRepository.save(fleet);
  }
}

module.exports = RegisterVehicleHandler;
