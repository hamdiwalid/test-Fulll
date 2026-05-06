class GetFleetVehiclesHandler {
  constructor(fleetRepository, vehicleRepository) {
    this.fleetRepository = fleetRepository;
    this.vehicleRepository = vehicleRepository;
  }

  async handle(query) {
    const fleet = await this.fleetRepository.findById(query.fleetId);
    if (!fleet) throw new Error('Fleet not found');

    const vehicles = [];
    for (const plate of fleet.vehiclePlates) {
      const v = await this.vehicleRepository.findByPlateValue(plate);
      if (v) vehicles.push(v);
    }
    return vehicles;
  }
}

module.exports = GetFleetVehiclesHandler;
