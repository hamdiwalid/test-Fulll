const InMemoryFleetRepository = require('./Memory/InMemoryFleetRepository');
const InMemoryVehicleRepository = require('./Memory/InMemoryVehicleRepository');

const CreateFleetHandler = require('../App/Handlers/CreateFleetHandler');
const RegisterVehicleHandler = require('../App/Handlers/RegisterVehicleHandler');
const ParkVehicleHandler = require('../App/Handlers/ParkVehicleHandler');
const GetFleetVehiclesHandler = require('../App/Handlers/GetFleetVehiclesHandler');
const GetVehicleLocationHandler = require('../App/Handlers/GetVehicleLocationHandler');

// Container d'injection de dépendances : on assemble repos + handlers ici.
// Par défaut : repos en mémoire.
// Si DATABASE_URL est défini : on bascule sur PostgreSQL.
function buildContainer() {
  let fleetRepository;
  let vehicleRepository;

  if (process.env.DATABASE_URL) {
    const { Pool } = require('pg');
    const PostgresFleetRepository = require('./Postgres/PostgresFleetRepository');
    const PostgresVehicleRepository = require('./Postgres/PostgresVehicleRepository');

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    fleetRepository = new PostgresFleetRepository(pool);
    vehicleRepository = new PostgresVehicleRepository(pool);
  } else {
    fleetRepository = new InMemoryFleetRepository();
    vehicleRepository = new InMemoryVehicleRepository();
  }

  return {
    fleetRepository,
    vehicleRepository,
    handlers: {
      createFleet: new CreateFleetHandler(fleetRepository),
      registerVehicle: new RegisterVehicleHandler(fleetRepository, vehicleRepository),
      parkVehicle: new ParkVehicleHandler(fleetRepository, vehicleRepository),
      getFleetVehicles: new GetFleetVehiclesHandler(fleetRepository, vehicleRepository),
      getVehicleLocation: new GetVehicleLocationHandler(fleetRepository, vehicleRepository),
    },
  };
}

module.exports = { buildContainer };
