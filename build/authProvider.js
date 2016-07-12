"use strict";
var AuthProvider = (function () {
    function AuthProvider(SatellizerConfig) {
        this.SatellizerConfig = SatellizerConfig;
    }
    Object.defineProperty(AuthProvider.prototype, "baseUrl", {
        get: function () { return this.SatellizerConfig.baseUrl; },
        set: function (value) { this.SatellizerConfig.baseUrl = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "loginUrl", {
        get: function () { return this.SatellizerConfig.loginUrl; },
        set: function (value) { this.SatellizerConfig.loginUrl = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "signupUrl", {
        get: function () { return this.SatellizerConfig.signupUrl; },
        set: function (value) { this.SatellizerConfig.signupUrl = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "tokenRoot", {
        get: function () { return this.SatellizerConfig.tokenRoot; },
        set: function (value) { this.SatellizerConfig.tokenRoot = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "tokenName", {
        get: function () { return this.SatellizerConfig.tokenName; },
        set: function (value) { this.SatellizerConfig.tokenName = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "tokenPrefix", {
        get: function () { return this.SatellizerConfig.tokenPrefix; },
        set: function (value) { this.SatellizerConfig.tokenPrefix = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "unlinkUrl", {
        get: function () { return this.SatellizerConfig.unlinkUrl; },
        set: function (value) { this.SatellizerConfig.unlinkUrl = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "tokenHeader", {
        get: function () { return this.SatellizerConfig.tokenHeader; },
        set: function (value) { this.SatellizerConfig.tokenHeader = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "tokenType", {
        get: function () { return this.SatellizerConfig.tokenType; },
        set: function (value) { this.SatellizerConfig.tokenType = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "withCredentials", {
        get: function () { return this.SatellizerConfig.withCredentials; },
        set: function (value) { this.SatellizerConfig.withCredentials = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "storageType", {
        get: function () { return this.SatellizerConfig.storageType; },
        set: function (value) { this.SatellizerConfig.storageType = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "httpInterceptor", {
        get: function () { return this.SatellizerConfig.httpInterceptor; },
        set: function (value) {
            if (typeof value === 'function') {
                this.SatellizerConfig.httpInterceptor = value;
            }
            else {
                this.SatellizerConfig.httpInterceptor = function () { return value; };
            }
        },
        enumerable: true,
        configurable: true
    });
    AuthProvider.prototype.facebook = function (options) {
        Object.assign(this.SatellizerConfig.providers.facebook, options);
    };
    AuthProvider.prototype.google = function (options) {
        Object.assign(this.SatellizerConfig.providers.google, options);
    };
    AuthProvider.prototype.github = function (options) {
        Object.assign(this.SatellizerConfig.providers.github, options);
    };
    AuthProvider.prototype.instagram = function (options) {
        Object.assign(this.SatellizerConfig.providers.instagram, options);
    };
    AuthProvider.prototype.linkedin = function (options) {
        Object.assign(this.SatellizerConfig.providers.linkedin, options);
    };
    AuthProvider.prototype.twitter = function (options) {
        Object.assign(this.SatellizerConfig.providers.twitter, options);
    };
    AuthProvider.prototype.twitch = function (options) {
        Object.assign(this.SatellizerConfig.providers.twitch, options);
    };
    AuthProvider.prototype.live = function (options) {
        Object.assign(this.SatellizerConfig.providers.live, options);
    };
    AuthProvider.prototype.yahoo = function (options) {
        Object.assign(this.SatellizerConfig.providers.yahoo, options);
    };
    AuthProvider.prototype.bitbucket = function (options) {
        Object.assign(this.SatellizerConfig.providers.bitbucket, options);
    };
    AuthProvider.prototype.oauth1 = function (options) {
        this.SatellizerConfig.providers[options.name] = Object.assign({}, options, {
            oauthType: '1.0'
        });
    };
    AuthProvider.prototype.oauth2 = function (options) {
        this.SatellizerConfig.providers[options.name] = Object.assign({}, options, {
            oauthType: '2.0'
        });
    };
    AuthProvider.prototype.$get = function (SatellizerShared, SatellizerLocal, SatellizerOAuth) {
        return {
            login: function (user, options) { return SatellizerLocal.login(user, options); },
            signup: function (user, options) { return SatellizerLocal.signup(user, options); },
            logout: function () { return SatellizerShared.logout(); },
            authenticate: function (name, data) { return SatellizerOAuth.authenticate(name, data); },
            link: function (name, data) { return SatellizerOAuth.authenticate(name, data); },
            unlink: function (name, options) { return SatellizerOAuth.unlink(name, options); },
            isAuthenticated: function () { return SatellizerShared.isAuthenticated(); },
            getPayload: function () { return SatellizerShared.getPayload(); },
            getToken: function () { return SatellizerShared.getToken(); },
            setToken: function (token) { return SatellizerShared.setToken({ access_token: token }); },
            removeToken: function () { return SatellizerShared.removeToken(); },
            setStorageType: function (type) { return SatellizerShared.setStorageType(type); }
        };
    };
    AuthProvider.$inject = ['SatellizerConfig'];
    return AuthProvider;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthProvider;
//# sourceMappingURL=authProvider.js.map