var config = {};

class AuthProvider {
  constructor() {

  }

  get httpInterceptor() { return config.httpInterceptor; }
  set httpInterceptor(value) {
    if (typeof value === 'function') {
      config.httpInterceptor = value;
    } else {
      config.httpInterceptor = () => {
        return value;
      };
    }
  }

  get baseUrl() { return config.baseUrl; }
  set baseUrl(value) { config.baseUrl = value; }

  get loginUrl() { return config.loginUrl; }
  set loginUrl(value) { config.loginUrl = value; }

  get signupUrl() { return config.signupUrl; }
  set signupUrl(value) { config.signupUrl = value; }

  get tokenRoot() { return config.tokenRoot; }
  set tokenRoot(value) { config.tokenRoot = value; }

  get tokenName() { return config.tokenName; }
  set tokenName(value) { config.tokenName = value; }

  get tokenPrefix() { return config.tokenPrefix; }
  set tokenPrefix(value) { config.tokenPrefix = value; }

  get unlinkUrl() { return config.unlinkUrl; }
  set unlinkUrl(value) { config.unlinkUrl = value; }

  get authHeader() { return config.authHeader; }
  set authHeader(value) { config.authHeader = value; }

  get authToken() { return config.authToken; }
  set authToken(value) { config.authToken = value; }

  get withCredentials() { return config.withCredentials; }
  set withCredentials(value) { config.withCredentials = value; }

  get storageType() { return config.storageType; }
  set storageType(value) { config.storageType = value; }

  facebook(options) {
    return Object.assign({}, config.providers.facebook, options);
  }

  google(options) {
    return Object.assign({}, config.providers.google, options);
  }

  github(options) {
    return Object.assign({}, config.providers.github, options);
  }

  instagram(options) {
    return Object.assign({}, config.providers.instagram, options);
  }

  linkedin(options) {
    return Object.assign({}, config.providers.linkedin, options);
  }

  twitter(options) {
    return Object.assign({}, config.providers.twitter, options);
  }

  twitch(options) {
    return Object.assign({}, config.providers.twitch, options);
  }

  live(options) {
    return Object.assign({}, config.providers.live, options);
  }

  yahoo(options) {
    return Object.assign({}, config.providers.yahoo, options);
  }

  bitbucket(options) {
    return Object.assign({}, config.providers.bitbucket, options);
  }

  oauth1(options) {
    config.providers[options.name] = Object.assign({}, options, {
      oauthType: '1.0'
    });
  };

  oauth2(options) {
    config.providers[options.name] = Object.assign({}, options, {
      oauthType: '2.0'
    });
  };

  $get($q) {
    return {
      login: (user, options) => local.login(user, options),
      signup: (user, options) => local.signup(user, options),
      logout: () => shared.logout(),
      authenticate: (name, data) => oauth.authenticate(name, data),
      link: (name, data) => oauth.authenticate(name, data),
      unlink: (name, options) => oauth.unlink(name, options),
      getToken: () => shared.getToken(),
      setToken: (token) => shared.setToken({ access_token: token }),
      removeToken: () => shared.removeToken(),
      getPayload: () => shared.getPayload(),
      setStorageType: (type) => shared.setStorageType(type)
    }
  }
}

export default AuthProvider;
