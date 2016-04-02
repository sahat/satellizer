class Shared {
  constructor($window, $log, SatellizerConfig, SatellizerStorage) {
    this.$window = $window;
    this.$log = $log;
    this.config = SatellizerConfig;
    this.storage = SatellizerStorage;

    const { tokenName, tokenPrefix, tokenRoot } = this.config;
    this.tokenName = tokenPrefix ? [tokenPrefix, tokenName].join('_') : tokenName;
    this.tokenRoot = tokenRoot;
  }

  getToken() {
    return this.storage.get(this.tokenName);
  }

  getPayload() {
    const token = this.storage.get(this.tokenName);

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

    this.storage.set(this.tokenName, token);
  }

  removeToken() {
    this.storage.remove(this.tokenName);
  }

  isAuthenticated() {
    const token = this.storage.get(this.tokenName);

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
    this.storage.remove(this.tokenName);
  }

  setStorageType(type) {
    this.storageType = type;
  }
}

export default Shared;
