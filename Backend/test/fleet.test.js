// Tests d'intégration sur le cœur métier.
// On appelle directement les handlers : pas de HTTP, pas de GraphQL.
const test = require('node:test');
const assert = require('node:assert/strict');

const { buildContainer } = require('../src/Infra/Container');
const CreateFleetCommand = require('../src/App/Commands/CreateFleetCommand');
const RegisterVehicleCommand = require('../src/App/Commands/RegisterVehicleCommand');
const ParkVehicleCommand = require('../src/App/Commands/ParkVehicleCommand');
const GetFleetVehiclesQuery = require('../src/App/Queries/GetFleetVehiclesQuery');
const GetVehicleLocationQuery = require('../src/App/Queries/GetVehicleLocationQuery');

function setup() {
  const c = buildContainer();
  return c.handlers;
}

test('register a vehicle', async () => {
  const h = setup();
  const fleetId = await h.createFleet.handle(new CreateFleetCommand('user-1'));
  await h.registerVehicle.handle(new RegisterVehicleCommand(fleetId, 'AB-123-CD'));

  const vehicles = await h.getFleetVehicles.handle(new GetFleetVehiclesQuery(fleetId));
  assert.equal(vehicles.length, 1);
  assert.equal(vehicles[0].plateNumber.value, 'AB-123-CD');
});

test('prevent registering the same vehicle twice in the same fleet', async () => {
  const h = setup();
  const fleetId = await h.createFleet.handle(new CreateFleetCommand('user-1'));
  await h.registerVehicle.handle(new RegisterVehicleCommand(fleetId, 'AB-123-CD'));

  await assert.rejects(
    () => h.registerVehicle.handle(new RegisterVehicleCommand(fleetId, 'AB-123-CD')),
    /already registered/i
  );
});

test('a vehicle can belong to multiple fleets', async () => {
  const h = setup();
  const f1 = await h.createFleet.handle(new CreateFleetCommand('user-1'));
  const f2 = await h.createFleet.handle(new CreateFleetCommand('user-2'));

  await h.registerVehicle.handle(new RegisterVehicleCommand(f1, 'AB-123-CD'));
  await h.registerVehicle.handle(new RegisterVehicleCommand(f2, 'AB-123-CD'));

  const v1 = await h.getFleetVehicles.handle(new GetFleetVehiclesQuery(f1));
  const v2 = await h.getFleetVehicles.handle(new GetFleetVehiclesQuery(f2));
  assert.equal(v1[0].plateNumber.value, 'AB-123-CD');
  assert.equal(v2[0].plateNumber.value, 'AB-123-CD');
});

test('park a vehicle', async () => {
  const h = setup();
  const fleetId = await h.createFleet.handle(new CreateFleetCommand('user-1'));
  await h.registerVehicle.handle(new RegisterVehicleCommand(fleetId, 'AB-123-CD'));

  await h.parkVehicle.handle(
    new ParkVehicleCommand(fleetId, 'AB-123-CD', 48.8566, 2.3522, 35)
  );

  const loc = await h.getVehicleLocation.handle(
    new GetVehicleLocationQuery(fleetId, 'AB-123-CD')
  );
  assert.deepEqual({ lat: loc.lat, lng: loc.lng, alt: loc.alt }, {
    lat: 48.8566, lng: 2.3522, alt: 35,
  });
});

test('prevent parking at the same location twice', async () => {
  const h = setup();
  const fleetId = await h.createFleet.handle(new CreateFleetCommand('user-1'));
  await h.registerVehicle.handle(new RegisterVehicleCommand(fleetId, 'AB-123-CD'));
  await h.parkVehicle.handle(
    new ParkVehicleCommand(fleetId, 'AB-123-CD', 48.8566, 2.3522, 35)
  );

  await assert.rejects(
    () =>
      h.parkVehicle.handle(
        new ParkVehicleCommand(fleetId, 'AB-123-CD', 48.8566, 2.3522, 35)
      ),
    /already parked/i
  );
});

test('parking at a different location works', async () => {
  const h = setup();
  const fleetId = await h.createFleet.handle(new CreateFleetCommand('user-1'));
  await h.registerVehicle.handle(new RegisterVehicleCommand(fleetId, 'AB-123-CD'));
  await h.parkVehicle.handle(new ParkVehicleCommand(fleetId, 'AB-123-CD', 1, 1));
  await h.parkVehicle.handle(new ParkVehicleCommand(fleetId, 'AB-123-CD', 2, 2));

  const loc = await h.getVehicleLocation.handle(
    new GetVehicleLocationQuery(fleetId, 'AB-123-CD')
  );
  assert.equal(loc.lat, 2);
  assert.equal(loc.lng, 2);
});
