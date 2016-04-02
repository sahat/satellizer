class AuthProvider {
  constructor(SatellizerConfig) {
    this.config = SatellizerConfig;
  }

  get httpInterceptor() { return this.config.httpInterceptor; }
  set httpInterceptor(value) {
    if (typeof value === 'function') {
      this.config.httpInterceptor = value;
    } else {
      this.config.httpInterceptor = () => {
        return value;
      };
    }
  }

  get baseUrl() { return this.config.baseUrl; }
  set baseUrl(value) { this.config.baseUrl = value; }

  get loginUrl() { return this.config.loginUrl; }
  set loginUrl(value) { this.config.loginUrl = value; }

  get signupUrl() { return this.config.signupUrl; }
  set signupUrl(value) { this.config.signupUrl = value; }

  get tokenRoot() { return this.config.tokenRoot; }
  set tokenRoot(value) { this.config.tokenRoot = value; }

  get tokenName() { return this.config.tokenName; }
  set tokenName(value) { this.config.tokenName = value; }

  get tokenPrefix() { return this.config.tokenPrefix; }
  set tokenPrefix(value) { this.config.tokenPrefix = value; }

  get unlinkUrl() { return this.config.unlinkUrl; }
  set unlinkUrl(value) { this.config.unlinkUrl = value; }

  get authHeader() { return this.config.authHeader; }
  set authHeader(value) { this.config.authHeader = value; }

  get authToken() { return this.config.authToken; }
  set authToken(value) { this.config.authToken = value; }

  get withCredentials() { return this.config.withCredentials; }
  set withCredentials(value) { this.config.withCredentials = value; }

  get storageType() { return this.config.storageType; }
  set storageType(value) { this.config.storageType = value; }

  facebook(options) {
    return Object.assign({}, this.config.providers.facebook, options);
  }

  google(options) {
    return Object.assign({}, this.config.providers.google, options);
  }

  github(options) {
    return Object.assign({}, this.config.providers.github, options);
  }

  instagram(options) {
    return Object.assign({}, this.config.providers.instagram, options);
  }

  linkedin(options) {
    return Object.assign({}, this.config.providers.linkedin, options);
  }

  twitter(options) {
    return Object.assign({}, this.config.providers.twitter, options);
  }

  twitch(options) {
    return Object.assign({}, this.config.providers.twitch, options);
  }

  live(options) {
    return Object.assign({}, this.config.providers.live, options);
  }

  yahoo(options) {
    return Object.assign({}, this.config.providers.yahoo, options);
  }

  bitbucket(options) {
    return Object.assign({}, this.config.providers.bitbucket, options);
  }

  oauth1(options) {
    this.config.providers[options.name] = Object.assign({}, options, {
      oauthType: '1.0'
    });
  };

  oauth2(options) {
    this.config.providers[options.name] = Object.assign({}, options, {
      oauthType: '2.0'
    });
  };

  $get($q, SatellizerShared, SatellizerLocal, SatellizerOauth) {
    return {
      login: (user, options) => SatellizerLocal.login(user, options),
      signup: (user, options) => SatellizerLocal.signup(user, options),
      logout: () => SatellizerShared.logout(),
      authenticate: (name, data) => SatellizerOauth.authenticate(name, data),
      link: (name, data) => SatellizerOauth.authenticate(name, data),
      unlink: (name, options) => SatellizerOauth.unlink(name, options),
      getToken: () => SatellizerShared.getToken(),
      setToken: (token) => SatellizerShared.setToken({ access_token: token }),
      removeToken: () => SatellizerShared.removeToken(),
      getPayload: () => SatellizerShared.getPayload(),
      setStorageType: (type) => SatellizerShared.setStorageType(type)
    }
  }
}

export default AuthProvider;
