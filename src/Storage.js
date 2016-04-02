class Storage {
  constructor($window, SatellizerConfig) {
    this.$window = $window;
    this.config = SatellizerConfig;
    this.memoryStore = {};
    this.isStorageAvailable = this.checkIfAvailable();
  }

  checkIfAvailable() {
    try {
      const supported = this.config.storageType in this.$window && this.$window[this.config.storageType] !== null;
      if (supported) {
        const key = Math.random().toString(36).substring(7);
        this.$window[this.config.storageType].setItem(key, '');
        this.$window[this.config.storageType].removeItem(key);
      }
      return supported;
    } catch (e) {
      return false;
    }
  }

  get(key) {
    return this.isStorageAvailable ? this.$window[this.config.storageType].getItem(key) : this.memoryStore[key];
  }

  set(key, value) {
    return this.isStorageAvailable ? this.$window[this.config.storageType].setItem(key, value) : this.memoryStore[key] = value;
  }

  remove(key) {
    return this.isStorageAvailable ? this.$window[this.config.storageType].removeItem(key) : delete this.memoryStore[key];
  }
}

export default Storage;
