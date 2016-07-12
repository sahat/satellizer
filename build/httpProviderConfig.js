"use strict";
var HttpProviderConfig = (function () {
    function HttpProviderConfig($httpProvider) {
        this.$httpProvider = $httpProvider;
        $httpProvider.interceptors.push('SatellizerInterceptor');
    }
    HttpProviderConfig.$inject = ['$httpProvider'];
    return HttpProviderConfig;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HttpProviderConfig;
//# sourceMappingURL=httpProviderConfig.js.map