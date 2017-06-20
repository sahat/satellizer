import Config from './config';

export default class Storage {
  static $inject = ['$window', 'SatellizerConfig'];

  private memoryStore: any;
  private storageType: string;

  constructor(private $window: angular.IHttpService,
              private SatellizerConfig: Config) {
    this.memoryStore = {};
  }

  isStorageAvailable (storageType: string): boolean {
    var key = Math.random().toString(36)

    try {
      this.$window[storageType].setItem(key, '');
      this.$window[storageType].removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }

  get(key: string): string {
    if (this.isStorageAvailable(this.SatellizerConfig.storageType)) {
      return this.$window[this.SatellizerConfig.storageType].getItem(key);
    } else {
      return this.memoryStore[key];
    }
  }

  set(key: string, value: string): void {
    if (this.isStorageAvailable(this.SatellizerConfig.storageType)) {
      this.$window[this.SatellizerConfig.storageType].setItem(key, value);
    } else {
      this.memoryStore[key] = value;
    }
  }

  remove(key: string): void {
    if (this.isStorageAvailable(this.SatellizerConfig.storageType)) {
      this.$window[this.SatellizerConfig.storageType].removeItem(key);
    } else {
      delete this.memoryStore[key];
    }
  }
}
