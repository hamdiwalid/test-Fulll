// Position GPS : latitude, longitude, et altitude.
// Validée à la construction. Immuable.
class Location {
  constructor(lat, lng, alt = null) {
    if (typeof lat !== 'number' || lat < -90 || lat > 90) {
      throw new Error('Invalid latitude');
    }
    if (typeof lng !== 'number' || lng < -180 || lng > 180) {
      throw new Error('Invalid longitude');
    }
    if (alt !== null && typeof alt !== 'number') {
      throw new Error('Invalid altitude');
    }
    this.lat = lat;
    this.lng = lng;
    this.alt = alt;
    Object.freeze(this);
  }

  equals(other) {
    if (!(other instanceof Location)) return false;
    return this.lat === other.lat && this.lng === other.lng && this.alt === other.alt;
  }
}

module.exports = Location;
