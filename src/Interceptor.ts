class Interceptor {
  constructor($q, SatellizerConfig, SatellizerShared, SatellizerStorage) {
    this.$q = $q;
    this.config = SatellizerConfig;
    this.shared = SatellizerShared;
    this.storage = SatellizerStorage;
  }

  request(request) {
    if (request.skipAuthorization) {
      return request;
    }

    if (this.shared.isAuthenticated() && this.config.httpInterceptor(request)) {
      const tokenName = this.config.tokenPrefix ?
        [this.config.tokenPrefix, this.config.tokenName].join('_') : this.config.tokenName;
      let token = this.storage.get(tokenName);

      if (this.config.authHeader && this.config.authToken) {
        token = this.config.authToken + ' ' + token;
      }

      request.headers[this.config.authHeader] = token;
    }

    return request;
  }

  responseError(response) {
    return this.$q.reject(response);
  }
}

export default Interceptor;
