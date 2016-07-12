import Config from './config';
import { IOAuth1Options, IOAuth2Options } from './interface';

export default class AuthProvider {
  static $inject = ['SatellizerConfig'];

  constructor(private SatellizerConfig: Config) {}

  get baseUrl(): string { return this.SatellizerConfig.baseUrl; }
  set baseUrl(value) { this.SatellizerConfig.baseUrl = value; }

  get loginUrl(): string { return this.SatellizerConfig.loginUrl; }
  set loginUrl(value) { this.SatellizerConfig.loginUrl = value; }

  get signupUrl(): string { return this.SatellizerConfig.signupUrl; }
  set signupUrl(value) { this.SatellizerConfig.signupUrl = value; }

  get tokenRoot(): string { return this.SatellizerConfig.tokenRoot; }
  set tokenRoot(value) { this.SatellizerConfig.tokenRoot = value; }

  get tokenName(): string { return this.SatellizerConfig.tokenName; }
  set tokenName(value) { this.SatellizerConfig.tokenName = value; }

  get tokenPrefix(): string { return this.SatellizerConfig.tokenPrefix; }
  set tokenPrefix(value) { this.SatellizerConfig.tokenPrefix = value; }

  get unlinkUrl(): string { return this.SatellizerConfig.unlinkUrl; }
  set unlinkUrl(value) { this.SatellizerConfig.unlinkUrl = value; }

  get tokenHeader(): string { return this.SatellizerConfig.tokenHeader; }
  set tokenHeader(value) { this.SatellizerConfig.tokenHeader = value; }

  get tokenType(): string { return this.SatellizerConfig.tokenType; }
  set tokenType(value) { this.SatellizerConfig.tokenType = value; }

  get withCredentials(): boolean { return this.SatellizerConfig.withCredentials; }
  set withCredentials(value) { this.SatellizerConfig.withCredentials = value; }

  get storageType(): string { return this.SatellizerConfig.storageType; }
  set storageType(value) { this.SatellizerConfig.storageType = value; }

  get httpInterceptor(): boolean { return this.SatellizerConfig.httpInterceptor; }
  set httpInterceptor(value) {
    if (typeof value === 'function') {
      this.SatellizerConfig.httpInterceptor = value;
    } else {
      this.SatellizerConfig.httpInterceptor = () => value;
    }
  }

  facebook(options: IOAuth2Options): void {
    Object.assign(this.SatellizerConfig.providers.facebook, options);
  }

  google(options: IOAuth2Options): void {
    Object.assign(this.SatellizerConfig.providers.google, options);
  }

  github(options: IOAuth2Options): void {
    Object.assign(this.SatellizerConfig.providers.github, options);
  }

  instagram(options: IOAuth2Options): void {
    Object.assign(this.SatellizerConfig.providers.instagram, options);
  }

  linkedin(options: IOAuth2Options): void {
    Object.assign(this.SatellizerConfig.providers.linkedin, options);
  }

  twitter(options: IOAuth1Options): void {
    Object.assign(this.SatellizerConfig.providers.twitter, options);
  }

  twitch(options: IOAuth2Options): void {
    Object.assign(this.SatellizerConfig.providers.twitch, options);
  }

  live(options: IOAuth2Options): void {
    Object.assign(this.SatellizerConfig.providers.live, options);
  }

  yahoo(options: IOAuth2Options): void {
    Object.assign(this.SatellizerConfig.providers.yahoo, options);
  }

  bitbucket(options: IOAuth2Options): void {
    Object.assign(this.SatellizerConfig.providers.bitbucket, options);
  }

  oauth1(options: IOAuth1Options): void {
    this.SatellizerConfig.providers[options.name] = Object.assign({}, options, {
      oauthType: '1.0'
    });
  }

  oauth2(options: IOAuth2Options): void {
    this.SatellizerConfig.providers[options.name] = Object.assign({}, options, {
      oauthType: '2.0'
    });
  }

  $get(satellizerShared, satellizerLocal, satellizerOAuth): any {
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
