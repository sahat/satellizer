import Config from './Config';
import Shared from './Shared';
import Storage from './Storage';

export default class Interceptor {

  static $inject = ['$q', 'satellizerConfig', 'satellizerShared', 'satellizerStorage'];

  constructor(private $q: angular.IQService,
              private satellizerConfig: Config,
              private satellizerShared: Shared,
              private satellizerStorage: Storage) {
  }

  request = (request) => {
    if (request.skipAuthorization) {
      return request;
    }

    if (this.satellizerShared.isAuthenticated() && this.satellizerConfig.httpInterceptor(request)) {
      const tokenName = this.satellizerConfig.tokenPrefix ?
        [this.satellizerConfig.tokenPrefix, this.satellizerConfig.tokenName].join('_') : this.satellizerConfig.tokenName;
      let token = this.satellizerStorage.get(tokenName);

      if (this.satellizerConfig.authHeader && this.satellizerConfig.authToken) {
        token = this.satellizerConfig.authToken + ' ' + token;
      }

      request.headers[this.satellizerConfig.authHeader] = token;
    }

    return request;
  };

  responseError = (response) => {
    return this.$q.reject(response);
  };
}
