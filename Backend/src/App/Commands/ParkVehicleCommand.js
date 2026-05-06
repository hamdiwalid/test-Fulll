class ParkVehicleCommand {
  constructor(fleetId, plateNumber, lat, lng, alt = null) {
    this.fleetId = fleetId;
    this.plateNumber = plateNumber;
    this.lat = lat;
    this.lng = lng;
    this.alt = alt;
  }
}
module.exports = ParkVehicleCommand;
