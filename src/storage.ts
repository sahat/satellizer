import Config from './config';

export default class Storage {
  static $inject = ['$window', 'SatellizerConfig'];

  private memoryStore: any;
  private storageType: string;

  constructor(private $window: angular.IHttpService,
              private SatellizerConfig: Config) {
    this.memoryStore = {};
    this.storageType = SatellizerConfig.storageType;
  }

  get(key: string): string {
    try {
      return this.$window[this.storageType].getItem(key);
    } catch (e) {
      return this.memoryStore[key];
    }
  }

  set(key: string, value: string): void {
    try {
      this.$window[this.storageType].setItem(key, value);
    } catch (e) {
      this.memoryStore[key] = value;
    }
  }

  remove(key: string): void {
    try {
      this.$window[this.storageType].removeItem(key);
    } catch (e) {
      delete this.memoryStore[key];
    }
  }
}
