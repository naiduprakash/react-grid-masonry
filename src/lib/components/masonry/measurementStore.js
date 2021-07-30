export default class MeasurementStore {
  map = new WeakMap();

  get(key) {
    return this.map.get(key);
  }

  has(key) {
    return this.map.has(key);
  }

  set(key, value) {
    this.map.set(key, value);
  }

  reset() {
    this.map = new WeakMap();
  }
}
