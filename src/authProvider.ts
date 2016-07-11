import Config from './config';
import { IOAuth1Options, IOAuth2Options } from './interface';

export default class AuthProvider {
  static $inject = ['satellizerConfig'];

  constructor(private satellizerConfig: Config) {}

  get baseUrl(): string { return this.satellizerConfig.baseUrl; }
  set baseUrl(value) { this.satellizerConfig.baseUrl = value; }

  get loginUrl(): string { return this.satellizerConfig.loginUrl; }
  set loginUrl(value) { this.satellizerConfig.loginUrl = value; }

  get signupUrl(): string { return this.satellizerConfig.signupUrl; }
  set signupUrl(value) { this.satellizerConfig.signupUrl = value; }

  get tokenRoot(): string { return this.satellizerConfig.tokenRoot; }
  set tokenRoot(value) { this.satellizerConfig.tokenRoot = value; }

  get tokenName(): string { return this.satellizerConfig.tokenName; }
  set tokenName(value) { this.satellizerConfig.tokenName = value; }

  get tokenPrefix(): string { return this.satellizerConfig.tokenPrefix; }
  set tokenPrefix(value) { this.satellizerConfig.tokenPrefix = value; }

  get unlinkUrl(): string { return this.satellizerConfig.unlinkUrl; }
  set unlinkUrl(value) { this.satellizerConfig.unlinkUrl = value; }

  get tokenHeader(): string { return this.satellizerConfig.tokenHeader; }
  set tokenHeader(value) { this.satellizerConfig.tokenHeader = value; }

  get tokenType(): string { return this.satellizerConfig.tokenType; }
  set tokenType(value) { this.satellizerConfig.tokenType = value; }

  get withCredentials(): boolean { return this.satellizerConfig.withCredentials; }
  set withCredentials(value) { this.satellizerConfig.withCredentials = value; }

  get storageType(): string { return this.satellizerConfig.storageType; }
  set storageType(value) { this.satellizerConfig.storageType = value; }

  get httpInterceptor(): boolean { return this.satellizerConfig.httpInterceptor; }
  set httpInterceptor(value) {
    if (typeof value === 'function') {
      this.satellizerConfig.httpInterceptor = value;
    } else {
      this.satellizerConfig.httpInterceptor = () => value;
    }
  }

  facebook(options: IOAuth2Options): void {
    Object.assign(this.satellizerConfig.providers.facebook, options);
  }

  google(options: IOAuth2Options): void {
    Object.assign(this.satellizerConfig.providers.google, options);
  }

  github(options: IOAuth2Options): void {
    Object.assign(this.satellizerConfig.providers.github, options);
  }

  instagram(options: IOAuth2Options): void {
    Object.assign(this.satellizerConfig.providers.instagram, options);
  }

  linkedin(options: IOAuth2Options): void {
    Object.assign(this.satellizerConfig.providers.linkedin, options);
  }

  twitter(options: IOAuth1Options): void {
    Object.assign(this.satellizerConfig.providers.twitter, options);
  }

  twitch(options: IOAuth2Options): void {
    Object.assign(this.satellizerConfig.providers.twitch, options);
  }

  live(options: IOAuth2Options): void {
    Object.assign(this.satellizerConfig.providers.live, options);
  }

  yahoo(options: IOAuth2Options): void {
    Object.assign(this.satellizerConfig.providers.yahoo, options);
  }

  bitbucket(options: IOAuth2Options): void {
    Object.assign(this.satellizerConfig.providers.bitbucket, options);
  }

  oauth1(options: IOAuth1Options): void {
    this.satellizerConfig.providers[options.name] = Object.assign({}, options, {
      oauthType: '1.0'
    });
  }

  oauth2(options: IOAuth2Options): void {
    this.satellizerConfig.providers[options.name] = Object.assign({}, options, {
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
