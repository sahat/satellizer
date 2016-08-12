import Config from './config';
import Storage from './storage';
import { decodeBase64 } from './utils';

class Shared {
  static $inject = ['$q', '$window', 'SatellizerConfig', 'SatellizerStorage'];
  
  private prefixedTokenName: string;

  constructor(private $q: angular.IQService,
              private $window: angular.IWindowService,
              private SatellizerConfig: Config,
              private SatellizerStorage: Storage) {
    const { tokenName, tokenPrefix } = this.SatellizerConfig;
    this.prefixedTokenName = tokenPrefix ? [tokenPrefix, tokenName].join('_') : tokenName;
  }

  getToken(): string {
    return this.SatellizerStorage.get(this.prefixedTokenName);
  }

  getPayload(): any {
    const token = this.SatellizerStorage.get(this.prefixedTokenName);

    if (token && token.split('.').length === 3) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(decodeBase64(base64));
      } catch (e) {
        // no-op
      }
    }
  }

  setToken(response): void {
    const tokenRoot = this.SatellizerConfig.tokenRoot;
    const tokenName = this.SatellizerConfig.tokenName;
    const accessToken = response && response.access_token;

    let token;

    if (accessToken) {
      if (angular.isObject(accessToken) && angular.isObject(accessToken.data)) {
        response = accessToken;
      } else if (angular.isString(accessToken)) {
        token = accessToken;
      }
    }

    if (!token && response) {
      const tokenRootData = tokenRoot && tokenRoot.split('.').reduce((o, x) => o[x], response.data);
      token = tokenRootData ? tokenRootData[tokenName] : response.data && response.data[tokenName];
    }

    if (token) {
      this.SatellizerStorage.set(this.prefixedTokenName, token);
    }
  }

  removeToken(): void {
    this.SatellizerStorage.remove(this.prefixedTokenName);
  }

  isAuthenticated(): boolean {
    const token = this.SatellizerStorage.get(this.prefixedTokenName);

    if (token) {  // Token is present
      if (token.split('.').length === 3) {  // Token with a valid JWT format XXX.YYY.ZZZ
        try { // Could be a valid JWT or an access token with the same format
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace('-', '+').replace('_', '/');
          const exp = JSON.parse(this.$window.atob(base64)).exp;
          if (typeof exp === 'number') {  // JWT with an optonal expiration claims
            return Math.round(new Date().getTime() / 1000) < exp;
          }
        } catch (e) {
          return true;  // Pass: Non-JWT token that looks like JWT
        }
      }
      return true;  // Pass: All other tokens
    }
    return false; // Fail: No token at all
  }

  logout(): angular.IPromise<void> {
    this.SatellizerStorage.remove(this.prefixedTokenName);
    return this.$q.when();
  }

  setStorageType(type): void {
    this.SatellizerConfig.storageType = type;
  }
}

export default Shared;
