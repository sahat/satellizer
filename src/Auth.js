"use strict";
var AuthProvider = (function () {
    function AuthProvider(SatellizerConfig) {
        this.config = SatellizerConfig;
    }
    Object.defineProperty(AuthProvider.prototype, "baseUrl", {
        get: function () { return this.config.baseUrl; },
        set: function (value) { this.config.baseUrl = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "loginUrl", {
        get: function () { return this.config.loginUrl; },
        set: function (value) { this.config.loginUrl = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "signupUrl", {
        get: function () { return this.config.signupUrl; },
        set: function (value) { this.config.signupUrl = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "tokenRoot", {
        get: function () { return this.config.tokenRoot; },
        set: function (value) { this.config.tokenRoot = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "tokenName", {
        get: function () { return this.config.tokenName; },
        set: function (value) { this.config.tokenName = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "tokenPrefix", {
        get: function () { return this.config.tokenPrefix; },
        set: function (value) { this.config.tokenPrefix = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "unlinkUrl", {
        get: function () { return this.config.unlinkUrl; },
        set: function (value) { this.config.unlinkUrl = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "authHeader", {
        get: function () { return this.config.authHeader; },
        set: function (value) { this.config.authHeader = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "authToken", {
        get: function () { return this.config.authToken; },
        set: function (value) { this.config.authToken = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "withCredentials", {
        get: function () { return this.config.withCredentials; },
        set: function (value) { this.config.withCredentials = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "storageType", {
        get: function () { return this.config.storageType; },
        set: function (value) { this.config.storageType = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "httpInterceptor", {
        get: function () { return this.config.httpInterceptor; },
        set: function (value) {
            if (typeof value === 'function') {
                this.config.httpInterceptor = value;
            }
            else {
                this.config.httpInterceptor = function () { return value; };
            }
        },
        enumerable: true,
        configurable: true
    });
    AuthProvider.prototype.facebook = function (options) {
        return Object.assign({}, this.config.providers.facebook, options);
    };
    AuthProvider.prototype.google = function (options) {
        Object.assign(this.config.providers.google, options);
    };
    AuthProvider.prototype.github = function (options) {
        Object.assign(this.config.providers.github, options);
    };
    AuthProvider.prototype.instagram = function (options) {
        Object.assign(this.config.providers.instagram, options);
    };
    AuthProvider.prototype.linkedin = function (options) {
        Object.assign(this.config.providers.linkedin, options);
    };
    AuthProvider.prototype.twitter = function (options) {
        Object.assign(this.config.providers.twitter, options);
    };
    AuthProvider.prototype.twitch = function (options) {
        Object.assign(this.config.providers.twitch, options);
    };
    AuthProvider.prototype.live = function (options) {
        Object.assign(this.config.providers.live, options);
    };
    AuthProvider.prototype.yahoo = function (options) {
        Object.assign(this.config.providers.yahoo, options);
    };
    AuthProvider.prototype.bitbucket = function (options) {
        Object.assign(this.config.providers.bitbucket, options);
    };
    AuthProvider.prototype.oauth1 = function (options) {
        this.config.providers[options.name] = Object.assign({}, options, {
            oauthType: '1.0'
        });
    };
    ;
    AuthProvider.prototype.oauth2 = function (options) {
        this.config.providers[options.name] = Object.assign({}, options, {
            oauthType: '2.0'
        });
    };
    ;
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
    return AuthProvider;
}());
exports.__esModule = true;
exports["default"] = AuthProvider;
