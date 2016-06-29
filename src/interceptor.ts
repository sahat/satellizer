import Config from './config';
import Shared from './shared';
import Storage from './storage';

export default class Interceptor {

  static $inject = ['$q', 'satellizerConfig', 'satellizerShared', 'satellizerStorage'];

  constructor(private $q: angular.IQService,
              private satellizerConfig: Config,
              private satellizerShared: Shared,
              private satellizerStorage: Storage) {
  }

  request = (request): any => {
    if (request.skipAuthorization) {
      return request;
    }

    if (this.satellizerShared.isAuthenticated() && this.satellizerConfig.httpInterceptor()) {
      const tokenName = this.satellizerConfig.tokenPrefix ?
        [this.satellizerConfig.tokenPrefix, this.satellizerConfig.tokenName].join('_') : this.satellizerConfig.tokenName;
      let token = this.satellizerStorage.get(tokenName);

      if (this.satellizerConfig.tokenHeader && this.satellizerConfig.tokenType) {
        token = this.satellizerConfig.tokenType + ' ' + token;
      }

      request.headers[this.satellizerConfig.tokenHeader] = token;
    }

    return request;
  };

  responseError = (response): any => {
    return this.$q.reject(response);
  };
}
