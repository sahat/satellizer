import Config from './config';
import Shared from './shared';
import Storage from './storage';

export default class Interceptor {

  static $inject = ['SatellizerConfig', 'SatellizerShared', 'SatellizerStorage'];

  constructor(private SatellizerConfig: Config,
              private SatellizerShared: Shared,
              private SatellizerStorage: Storage) {
  }

  request = (request): any => {
    if (request.skipAuthorization) {
      return request;
    }

    if (this.SatellizerShared.isAuthenticated() && this.SatellizerConfig.httpInterceptor()) {
      const tokenName = this.SatellizerConfig.tokenPrefix ?
        [this.SatellizerConfig.tokenPrefix, this.SatellizerConfig.tokenName].join('_') : this.SatellizerConfig.tokenName;
      let token = this.SatellizerStorage.get(tokenName);

      if (this.SatellizerConfig.tokenHeader && this.SatellizerConfig.tokenType) {
        token = this.SatellizerConfig.tokenType + ' ' + token;
      }

      request.headers[this.SatellizerConfig.tokenHeader] = token;
    }

    return request;
  };
}
