const CreateFleetCommand = require('../App/Commands/CreateFleetCommand');
const RegisterVehicleCommand = require('../App/Commands/RegisterVehicleCommand');
const ParkVehicleCommand = require('../App/Commands/ParkVehicleCommand');
const GetFleetVehiclesQuery = require('../App/Queries/GetFleetVehiclesQuery');
const GetVehicleLocationQuery = require('../App/Queries/GetVehicleLocationQuery');

// Resolvers GraphQL.
// Pas de logique métier ici : on traduit les arguments en Command/Query,
// on appelle le bon handler, puis on remappe le résultat vers le schéma.
function buildResolvers(container) {
  const { handlers } = container;

  const toVehicleDTO = v => ({
    plateNumber: v.plateNumber.value,
    location: v.location
      ? { lat: v.location.lat, lng: v.location.lng, alt: v.location.alt }
      : null,
  });

  return {
    Query: {
      fleetVehicles: async (_, { fleetId }) => {
        const vehicles = await handlers.getFleetVehicles.handle(
          new GetFleetVehiclesQuery(fleetId)
        );
        return vehicles.map(toVehicleDTO);
      },
      vehicleLocation: async (_, { fleetId, plateNumber }) => {
        const loc = await handlers.getVehicleLocation.handle(
          new GetVehicleLocationQuery(fleetId, plateNumber)
        );
        return loc ? { lat: loc.lat, lng: loc.lng, alt: loc.alt } : null;
      },
    },
    Mutation: {
      createFleet: async (_, { userId }) =>
        handlers.createFleet.handle(new CreateFleetCommand(userId)),

      registerVehicle: async (_, { fleetId, plateNumber }) => {
        await handlers.registerVehicle.handle(
          new RegisterVehicleCommand(fleetId, plateNumber)
        );
        return true;
      },

      parkVehicle: async (_, { fleetId, plateNumber, lat, lng, alt }) => {
        await handlers.parkVehicle.handle(
          new ParkVehicleCommand(fleetId, plateNumber, lat, lng, alt ?? null)
        );
        return true;
      },
    },
  };
}

module.exports = buildResolvers;
