const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');

const { buildContainer } = require('../../src/Infra/Container');

const CreateFleetCommand = require('../../src/App/Commands/CreateFleetCommand');
const RegisterVehicleCommand = require('../../src/App/Commands/RegisterVehicleCommand');
const ParkVehicleCommand = require('../../src/App/Commands/ParkVehicleCommand');
const GetFleetVehiclesQuery = require('../../src/App/Queries/GetFleetVehiclesQuery');
const GetVehicleLocationQuery = require('../../src/App/Queries/GetVehicleLocationQuery');

Before(function () {
  this.container = buildContainer();
  this.h = this.container.handlers;
  this.lastError = null;
});

async function safe(fn, world) {
  try {
    world.lastError = null;
    return await fn();
  } catch (err) {
    world.lastError = err;
  }
}

Given('my fleet', async function () {
  this.myFleetId = await this.h.createFleet.handle(new CreateFleetCommand('user-1'));
});

Given("the fleet of another user", async function () {
  this.otherFleetId = await this.h.createFleet.handle(new CreateFleetCommand('user-2'));
});

Given('a vehicle', function () {
  this.plate = 'AB-123-CD';
});

Given('I have registered this vehicle into my fleet', async function () {
  await this.h.registerVehicle.handle(
    new RegisterVehicleCommand(this.myFleetId, this.plate)
  );
});

Given("this vehicle has been registered into the other user's fleet", async function () {
  await this.h.registerVehicle.handle(
    new RegisterVehicleCommand(this.otherFleetId, this.plate)
  );
});

Given('a location', function () {
  this.location = { lat: 48.8566, lng: 2.3522, alt: 35 };
});

Given('my vehicle has been parked into this location', async function () {
  await this.h.parkVehicle.handle(
    new ParkVehicleCommand(
      this.myFleetId,
      this.plate,
      this.location.lat,
      this.location.lng,
      this.location.alt
    )
  );
});

When('I register this vehicle into my fleet', async function () {
  await safe(
    () =>
      this.h.registerVehicle.handle(
        new RegisterVehicleCommand(this.myFleetId, this.plate)
      ),
    this
  );
});

When('I try to register this vehicle into my fleet', async function () {
  await safe(
    () =>
      this.h.registerVehicle.handle(
        new RegisterVehicleCommand(this.myFleetId, this.plate)
      ),
    this
  );
});

When('I park my vehicle at this location', async function () {
  await safe(
    () =>
      this.h.parkVehicle.handle(
        new ParkVehicleCommand(
          this.myFleetId,
          this.plate,
          this.location.lat,
          this.location.lng,
          this.location.alt
        )
      ),
    this
  );
});

When('I try to park my vehicle at this location', async function () {
  await safe(
    () =>
      this.h.parkVehicle.handle(
        new ParkVehicleCommand(
          this.myFleetId,
          this.plate,
          this.location.lat,
          this.location.lng,
          this.location.alt
        )
      ),
    this
  );
});

Then("this vehicle should be part of my fleet's vehicles", async function () {
  const vehicles = await this.h.getFleetVehicles.handle(
    new GetFleetVehiclesQuery(this.myFleetId)
  );
  const plates = vehicles.map(v => v.plateNumber.value);
  assert.ok(plates.includes(this.plate.toUpperCase()));
});

Then("this vehicle should be part of the other user's fleet's vehicles", async function () {
  const vehicles = await this.h.getFleetVehicles.handle(
    new GetFleetVehiclesQuery(this.otherFleetId)
  );
  const plates = vehicles.map(v => v.plateNumber.value);
  assert.ok(plates.includes(this.plate.toUpperCase()));
});

Then(
  'I should be told this vehicle has already been registered into my fleet',
  function () {
    assert.ok(this.lastError, 'Expected an error');
    assert.match(this.lastError.message, /already registered/i);
  }
);

Then('the known location of my vehicle should verify this location', async function () {
  const loc = await this.h.getVehicleLocation.handle(
    new GetVehicleLocationQuery(this.myFleetId, this.plate)
  );
  assert.ok(loc);
  assert.strictEqual(loc.lat, this.location.lat);
  assert.strictEqual(loc.lng, this.location.lng);
  assert.strictEqual(loc.alt, this.location.alt);
});

Then(
  'I should be told that my vehicle is already parked at this location',
  function () {
    assert.ok(this.lastError, 'Expected an error');
    assert.match(this.lastError.message, /already parked/i);
  }
);
