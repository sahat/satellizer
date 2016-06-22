import Config from './config';

export default class Storage {
  static $inject = ['$window', 'satellizerConfig'];
  
  private memoryStore: Object;

  constructor(private $window: angular.IHttpService,
              private satellizerConfig: Config) {
    
    this.memoryStore = {};
  }

  get(key: string) {
    try {
      return this.$window[this.satellizerConfig.storageType].getItem(key);
    } catch (e) {
      return this.memoryStore[key];
    }
  }

  set(key: string, value: string) {
    try {
      this.$window[this.satellizerConfig.storageType].setItem(key, value);
    } catch (e) {
      this.memoryStore[key] = value;
    }
  }

  remove(key: string) {
    try {
      this.$window[this.satellizerConfig.storageType].removeItem(key);
    } catch (e) {
      delete this.memoryStore[key];
    }
  }
}
