"use strict";
var Storage = (function () {
    function Storage($window, SatellizerConfig) {
        this.$window = $window;
        this.SatellizerConfig = SatellizerConfig;
        this.memoryStore = {};
        this.storageType = SatellizerConfig.storageType;
    }
    Storage.prototype.get = function (key) {
        try {
            return this.$window[this.storageType].getItem(key);
        }
        catch (e) {
            return this.memoryStore[key];
        }
    };
    Storage.prototype.set = function (key, value) {
        try {
            this.$window[this.storageType].setItem(key, value);
        }
        catch (e) {
            this.memoryStore[key] = value;
        }
    };
    Storage.prototype.remove = function (key) {
        try {
            this.$window[this.storageType].removeItem(key);
        }
        catch (e) {
            delete this.memoryStore[key];
        }
    };
    Storage.$inject = ['$window', 'SatellizerConfig'];
    return Storage;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Storage;
//# sourceMappingURL=storage.js.map