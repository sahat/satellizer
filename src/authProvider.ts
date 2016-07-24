import Config from './config';
import { IOAuth1Options } from './oauth1';
import { IOAuth2Options } from './oauth2';

export default class AuthProvider {
  static $inject = ['SatellizerConfig'];

  constructor(private SatellizerConfig: Config) {}

  get baseUrl(): string { return this.SatellizerConfig.baseUrl; }
  set baseUrl(value) { this.SatellizerConfig.baseUrl = value; }

  get loginUrl(): string { return this.SatellizerConfig.loginUrl; }
  set loginUrl(value) { this.SatellizerConfig.loginUrl = value; }

  get signupUrl(): string { return this.SatellizerConfig.signupUrl; }
  set signupUrl(value) { this.SatellizerConfig.signupUrl = value; }

  get unlinkUrl(): string { return this.SatellizerConfig.unlinkUrl; }
  set unlinkUrl(value) { this.SatellizerConfig.unlinkUrl = value; }

  get tokenRoot(): string { return this.SatellizerConfig.tokenRoot; }
  set tokenRoot(value) { this.SatellizerConfig.tokenRoot = value; }

  get tokenName(): string { return this.SatellizerConfig.tokenName; }
  set tokenName(value) { this.SatellizerConfig.tokenName = value; }

  get tokenPrefix(): string { return this.SatellizerConfig.tokenPrefix; }
  set tokenPrefix(value) { this.SatellizerConfig.tokenPrefix = value; }

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
    angular.extend(this.SatellizerConfig.providers.facebook, options);
  }

  google(options: IOAuth2Options): void {
    angular.extend(this.SatellizerConfig.providers.google, options);
  }

  github(options: IOAuth2Options): void {
    angular.extend(this.SatellizerConfig.providers.github, options);
  }

  instagram(options: IOAuth2Options): void {
    angular.extend(this.SatellizerConfig.providers.instagram, options);
  }

  linkedin(options: IOAuth2Options): void {
    angular.extend(this.SatellizerConfig.providers.linkedin, options);
  }

  twitter(options: IOAuth1Options): void {
    angular.extend(this.SatellizerConfig.providers.twitter, options);
  }

  twitch(options: IOAuth2Options): void {
    angular.extend(this.SatellizerConfig.providers.twitch, options);
  }

  live(options: IOAuth2Options): void {
    angular.extend(this.SatellizerConfig.providers.live, options);
  }

  yahoo(options: IOAuth2Options): void {
    angular.extend(this.SatellizerConfig.providers.yahoo, options);
  }

  bitbucket(options: IOAuth2Options): void {
    angular.extend(this.SatellizerConfig.providers.bitbucket, options);
  }

  spotify(options: IOAuth2Options): void {
    angular.extend(this.SatellizerConfig.providers.spotify, options);
  }

  oauth1(options: IOAuth1Options): void {
    this.SatellizerConfig.providers[options.name] = angular.extend(options, {
      oauthType: '1.0'
    });
  }

  oauth2(options: IOAuth2Options): void {
    this.SatellizerConfig.providers[options.name] = angular.extend(options, {
      oauthType: '2.0'
    });
  }

  $get(SatellizerShared, SatellizerLocal, SatellizerOAuth): any {
    return {
      login: (user, options) => SatellizerLocal.login(user, options),
      signup: (user, options) => SatellizerLocal.signup(user, options),
      logout: () => SatellizerShared.logout(),
      authenticate: (name, data) => SatellizerOAuth.authenticate(name, data),
      link: (name, data) => SatellizerOAuth.authenticate(name, data),
      unlink: (name, options) => SatellizerOAuth.unlink(name, options),
      isAuthenticated: () => SatellizerShared.isAuthenticated(),
      getPayload: () => SatellizerShared.getPayload(),
      getToken: () => SatellizerShared.getToken(),
      setToken: (token) => SatellizerShared.setToken({ access_token: token }),
      removeToken: () => SatellizerShared.removeToken(),
      setStorageType: (type) => SatellizerShared.setStorageType(type)
    };
  }
}

AuthProvider.prototype.$get.$inject = ['SatellizerShared', 'SatellizerLocal', 'SatellizerOAuth'];
