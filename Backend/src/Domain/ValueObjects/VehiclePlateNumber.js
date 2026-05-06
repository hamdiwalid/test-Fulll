// Plaque d'immatriculation. Une simple chaîne non vide,
// normalisée en majuscules. Immuable.
class VehiclePlateNumber {
  constructor(value) {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new Error('VehiclePlateNumber must be a non-empty string');
    }
    this.value = value.trim().toUpperCase();
    Object.freeze(this);
  }

  equals(other) {
    return other instanceof VehiclePlateNumber && this.value === other.value;
  }

  toString() {
    return this.value;
  }
}

module.exports = VehiclePlateNumber;
