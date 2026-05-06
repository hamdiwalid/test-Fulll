class RegisterVehicleCommand {
  constructor(fleetId, plateNumber) {
    this.fleetId = fleetId;
    this.plateNumber = plateNumber;
  }
}
module.exports = RegisterVehicleCommand;
