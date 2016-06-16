import Config from './Config';
import Shared from './Shared';
import Storage from './Storage';

export default class Interceptor {
  static $inject = ['$q'];

  constructor(private $q: angular.IQService,
              private config: Config,
              private shared: Shared,
              private storage: Storage) {}

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
