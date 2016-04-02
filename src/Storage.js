import Config from './Config';

class Storage {
  constructor($window) {
    this.$window = $window;
    this.memoryStore = {};
    this.isStorageAvailable = this.checkIfAvailable();
  }

  checkIfAvailable() {
    try {
      const supported = Config.storageType in this.$window && this.$window[Config.storageType] !== null;
      if (supported) {
        const key = Math.random().toString(36).substring(7);
        this.$window[Config.storageType].setItem(key, '');
        this.$window[Config.storageType].removeItem(key);
      }
      return supported;
    } catch (e) {
      return false;
    }
  }

  get(key) {
    return this.isStorageAvailable ? this.$window[Config.storageType].getItem(key) : this.memoryStore[key];
  }

  set(key, value) {
    return this.isStorageAvailable ? this.$window[Config.storageType].setItem(key, value) : this.memoryStore[key] = value;
  }

  remove(key) {
    return this.isStorageAvailable ? this.$window[Config.storageType].removeItem(key) : delete this.memoryStore[key];
  }
}

export default Storage;
