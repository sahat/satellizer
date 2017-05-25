import Config from './config';

export default class Storage {
  static $inject = ['$window', 'SatellizerConfig'];

  private memoryStore: any;
  private storageType: string;
  private isStorageAvailable: boolean;

  constructor(private $window: angular.IHttpService,
              private SatellizerConfig: Config) {
    this.memoryStore = {};
    this.isStorageAvailable = (()=> {
      try {
        var supported = SatellizerConfig.storageType in $window && $window[SatellizerConfig.storageType] !== null;

        if (supported) {
          var key = Math.random().toString(36).substring(7);
          $window[SatellizerConfig.storageType].setItem(key, '');
          $window[SatellizerConfig.storageType].removeItem(key);
        }

        return supported;
      } catch (e) {
        return false;
      }
    })();
  }

  get(key: string): string {
    try {
      return this.isStorageAvailable ? this.$window[this.SatellizerConfig.storageType].getItem(key) : this.memoryStore[key];
    } catch (e) {
      return this.memoryStore[key];
    }
  }

  set(key: string, value: string): void {
    try {
      this.isStorageAvailable ? this.$window[this.SatellizerConfig.storageType].setItem(key, value) : this.memoryStore[key] = value;
    } catch (e) {
      this.memoryStore[key] = value;
    }
  }

  remove(key: string): void {
    try {
      this.isStorageAvailable ? this.$window[this.SatellizerConfig.storageType].removeItem(key) : delete this.memoryStore[key];
    } catch (e) {
      delete this.memoryStore[key];
    }
  }
}
