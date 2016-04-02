import Config from './Config';
import Storage from './Storage';

class Shared {
  constructor($q, $window, $log) {
    const { tokenName, tokenPrefix, tokenRoot } = Config;
    this.tokenName = tokenPrefix ? [tokenPrefix, tokenName].join('_') : tokenName;
    this.tokenRoot = tokenRoot;
    this.$window = $window;
    this.$log = $log;
  }

  getToken() {
    return Storage.get(this.tokenName);
  }

  getPayload() {
    const token = Storage.get(this.tokenName);

    if (token && token.split('.').length === 3) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(decodeURIComponent(window.atob(base64)));
      } catch (e) {}
    }
  }

  setToken(response) {
    if (!response) {
      return this.$log.warn('Can\'t set token without passing a value');
    }

    let token;
    const accessToken = response && response.access_token;

    if (accessToken) {
      if (angular.isObject(accessToken) && angular.isObject(accessToken.data)) {
        response = accessToken;
      } else if (angular.isString(accessToken)) {
        token = accessToken;
      }
    }

    if (!token && response) {
      const tokenRootData = this.tokenRoot && this.tokenRoot.split('.').reduce(function(o, x) { return o[x]; }, response.data);
      token = tokenRootData ? tokenRootData[this.tokenName] : response.data && response.data[this.tokenName];
    }

    if (!token) {
      const tokenPath = this.tokenRoot ? this.tokenRoot + '.' + this.tokenName : this.tokenName;
      return this.$log.warn('Expecting a token named "' + tokenPath);
    }

    Storage.set(this.tokenName, token);
  }

  removeToken() {
    Storage.remove(this.tokenName);
  }

  isAuthenticated() {
    const token = Storage.get(this.tokenName);

    if (token) {  // Token is present
      if (token.split('.').length === 3) {  // Token with a valid JWT format XXX.YYY.ZZZ
        try { // Could be a valid JWT or an access token with the same format
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace('-', '+').replace('_', '/');
          const exp = JSON.parse(this.$window.atob(base64)).exp;
          if (exp) {  // JWT with an optonal expiration claims
            const isExpired = Math.round(new Date().getTime() / 1000) >= exp;
            if (isExpired) {
              return false; // FAIL: Expired token
            } else {
              return true;  // PASS: Non-expired token
            }
          }
        } catch (e) {
          return true;  // PASS: Non-JWT token that looks like JWT
        }
      }
      return true;  // PASS: All other tokens
    }
    return false; // FAIL: No token at all
  }

  logout() {
    Storage.remove(this.tokenName);
  }

  setStorageType(type) {
    Config.storageType = type;
  }
}

export default Shared;
