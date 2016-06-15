"use strict";
var Storage = (function () {
    function Storage($window, SatellizerConfig) {
        this.$window = $window;
        this.config = SatellizerConfig;
        this.memoryStore = {};
        this.isStorageAvailable = this.checkIfAvailable();
    }
    Storage.prototype.checkIfAvailable = function () {
        try {
            var supported = this.config.storageType in this.$window && this.$window[this.config.storageType] !== null;
            if (supported) {
                var key = Math.random().toString(36).substring(7);
                this.$window[this.config.storageType].setItem(key, '');
                this.$window[this.config.storageType].removeItem(key);
            }
            return supported;
        }
        catch (e) {
            return false;
        }
    };
    Storage.prototype.get = function (key) {
        return this.isStorageAvailable ? this.$window[this.config.storageType].getItem(key) : this.memoryStore[key];
    };
    Storage.prototype.set = function (key, value) {
        return this.isStorageAvailable ? this.$window[this.config.storageType].setItem(key, value) : this.memoryStore[key] = value;
    };
    Storage.prototype.remove = function (key) {
        return this.isStorageAvailable ? this.$window[this.config.storageType].removeItem(key) : delete this.memoryStore[key];
    };
    return Storage;
}());
exports.__esModule = true;
exports["default"] = Storage;
