const Fleet = require('../../Domain/Entities/Fleet');
const { randomUUID } = require('crypto');

class CreateFleetHandler {
  constructor(fleetRepository) {
    this.fleetRepository = fleetRepository;
  }

  async handle(command) {
    const fleet = new Fleet(randomUUID(), command.userId);
    await this.fleetRepository.save(fleet);
    return fleet.id;
  }
}

module.exports = CreateFleetHandler;
