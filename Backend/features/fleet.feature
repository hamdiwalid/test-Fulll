Feature: Fleet management
  As a fleet owner I want to manage vehicles in my fleet.

  Background:
    Given my fleet
    And the fleet of another user
    And a vehicle

  Scenario: Register a vehicle
    When I register this vehicle into my fleet
    Then this vehicle should be part of my fleet's vehicles

  Scenario: Prevent registering the same vehicle twice
    Given I have registered this vehicle into my fleet
    When I try to register this vehicle into my fleet
    Then I should be told this vehicle has already been registered into my fleet

  Scenario: A vehicle can be in multiple fleets
    Given this vehicle has been registered into the other user's fleet
    When I register this vehicle into my fleet
    Then this vehicle should be part of my fleet's vehicles
    And this vehicle should be part of the other user's fleet's vehicles

  Scenario: Park a vehicle
    Given I have registered this vehicle into my fleet
    And a location
    When I park my vehicle at this location
    Then the known location of my vehicle should verify this location

  Scenario: Prevent parking at the same location twice
    Given I have registered this vehicle into my fleet
    And a location
    And my vehicle has been parked into this location
    When I try to park my vehicle at this location
    Then I should be told that my vehicle is already parked at this location
