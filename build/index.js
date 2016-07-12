"use strict";
var config_1 = require('./config');
var authProvider_1 = require('./authProvider');
var shared_1 = require('./shared');
var local_1 = require('./local');
var popup_1 = require('./popup');
var oauth_1 = require('./oauth');
var oauth2_1 = require('./oauth2');
var oauth1_1 = require('./oauth1');
var storage_1 = require('./storage');
var interceptor_1 = require('./interceptor');
var httpProviderConfig_1 = require('./httpProviderConfig');
angular.module('satellizer', [])
    .provider('$auth', ['SatellizerConfig', function (SatellizerConfig) { return new authProvider_1.default(SatellizerConfig); }])
    .constant('SatellizerConfig', config_1.default.getConstant)
    .service('SatellizerShared', shared_1.default)
    .service('SatellizerLocal', local_1.default)
    .service('SatellizerPopup', popup_1.default)
    .service('SatellizerOAuth', oauth_1.default)
    .service('SatellizerOAuth2', oauth2_1.default)
    .service('SatellizerOAuth1', oauth1_1.default)
    .service('SatellizerStorage', storage_1.default)
    .service('SatellizerInterceptor', interceptor_1.default)
    .config(function ($httpProvider) { return new httpProviderConfig_1.default($httpProvider); });
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = 'satellizer';
//# sourceMappingURL=index.js.map