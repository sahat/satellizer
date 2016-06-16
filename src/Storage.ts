import Config from './Config';

export default class Storage {
  static $inject = ['$window'];

  private memoryStore: Object;

  constructor(private $window: angular.IHttpService, private config: Config) {
    this.memoryStore = {};
  }

  get(key: string) {
    try {
      return this.$window[this.config.storageType].getItem(key);
    } catch (e) {
      return this.memoryStore[key];
    }
  }

  set(key: string, value: string) {
    try {
      this.$window[this.config.storageType].setItem(key, value);
    } catch (e) {
      this.memoryStore[key] = value;
    }
  }

  remove(key: string) {
    try {
      this.$window[this.config.storageType].removeItem(key);
    } catch (e) {
      delete this.memoryStore[key];
    }
  }
}
