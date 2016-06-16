export default class Storage {
    constructor($window, satellizerConfig) {
        this.$window = $window;
        this.satellizerConfig = satellizerConfig;
        this.memoryStore = {};
    }
    get(key) {
        try {
            return this.$window[this.satellizerConfig.storageType].getItem(key);
        }
        catch (e) {
            return this.memoryStore[key];
        }
    }
    set(key, value) {
        try {
            this.$window[this.satellizerConfig.storageType].setItem(key, value);
        }
        catch (e) {
            this.memoryStore[key] = value;
        }
    }
    remove(key) {
        try {
            this.$window[this.satellizerConfig.storageType].removeItem(key);
        }
        catch (e) {
            delete this.memoryStore[key];
        }
    }
}
