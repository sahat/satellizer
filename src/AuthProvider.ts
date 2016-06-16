import Config from './Config';

export default class AuthProvider {
  static $inject = ['satellizerConfig'];

  constructor(private satellizerConfig: Config) {}

  get baseUrl() { return this.satellizerConfig.baseUrl; }
  set baseUrl(value) { this.satellizerConfig.baseUrl = value; }

  get loginUrl() { return this.satellizerConfig.loginUrl; }
  set loginUrl(value) { this.satellizerConfig.loginUrl = value; }

  get signupUrl() { return this.satellizerConfig.signupUrl; }
  set signupUrl(value) { this.satellizerConfig.signupUrl = value; }

  get tokenRoot() { return this.satellizerConfig.tokenRoot; }
  set tokenRoot(value) { this.satellizerConfig.tokenRoot = value; }

  get tokenName() { return this.satellizerConfig.tokenName; }
  set tokenName(value) { this.satellizerConfig.tokenName = value; }

  get tokenPrefix() { return this.satellizerConfig.tokenPrefix; }
  set tokenPrefix(value) { this.satellizerConfig.tokenPrefix = value; }

  get unlinkUrl() { return this.satellizerConfig.unlinkUrl; }
  set unlinkUrl(value) { this.satellizerConfig.unlinkUrl = value; }

  get authHeader() { return this.satellizerConfig.authHeader; }
  set authHeader(value) { this.satellizerConfig.authHeader = value; }

  get authToken() { return this.satellizerConfig.authToken; }
  set authToken(value) { this.satellizerConfig.authToken = value; }

  get withCredentials() { return this.satellizerConfig.withCredentials; }
  set withCredentials(value) { this.satellizerConfig.withCredentials = value; }

  get storageType() { return this.satellizerConfig.storageType; }
  set storageType(value) { this.satellizerConfig.storageType = value; }

  get httpInterceptor() { return this.satellizerConfig.httpInterceptor; }
  set httpInterceptor(value) {
    if (typeof value === 'function') {
      this.satellizerConfig.httpInterceptor = value;
    } else {
      this.satellizerConfig.httpInterceptor = () => value;
    }
  }

  facebook(options) {
    Object.assign(this.satellizerConfig.providers.facebook, options);
  }

  google(options) {
    Object.assign(this.satellizerConfig.providers.google, options);
  }

  github(options) {
    Object.assign(this.satellizerConfig.providers.github, options);
  }

  instagram(options) {
    Object.assign(this.satellizerConfig.providers.instagram, options);
  }

  linkedin(options) {
    Object.assign(this.satellizerConfig.providers.linkedin, options);
  }

  twitter(options) {
    Object.assign(this.satellizerConfig.providers.twitter, options);
  }

  twitch(options) {
    Object.assign(this.satellizerConfig.providers.twitch, options);
  }

  live(options) {
    Object.assign(this.satellizerConfig.providers.live, options);
  }

  yahoo(options) {
    Object.assign(this.satellizerConfig.providers.yahoo, options);
  }

  bitbucket(options) {
    Object.assign(this.satellizerConfig.providers.bitbucket, options);
  }

  oauth1(options) {
    this.satellizerConfig.providers[options.name] = Object.assign({}, options, {
      oauthType: '1.0'
    });
  }

  oauth2(options) {
    this.satellizerConfig.providers[options.name] = Object.assign({}, options, {
      oauthType: '2.0'
    });
  }

  $get(satellizerShared, satellizerLocal, satellizerOAuth) {
    return {
      login: (user, options) => satellizerLocal.login(user, options),
      signup: (user, options) => satellizerLocal.signup(user, options),
      logout: () => satellizerShared.logout(),
      authenticate: (name, data) => satellizerOAuth.authenticate(name, data),
      link: (name, data) => satellizerOAuth.authenticate(name, data),
      unlink: (name, options) => satellizerOAuth.unlink(name, options),
      isAuthenticated: () => satellizerShared.isAuthenticated(),
      getPayload: () => satellizerShared.getPayload(),
      getToken: () => satellizerShared.getToken(),
      setToken: (token) => satellizerShared.setToken({ access_token: token }),
      removeToken: () => satellizerShared.removeToken(),
      setStorageType: (type) => satellizerShared.setStorageType(type)
    };
  }
}
