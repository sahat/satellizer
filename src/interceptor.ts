import Config from './config';
import Shared from './shared';
import Storage from './storage';

export default class Interceptor implements angular.IHttpInterceptor {

  static $inject = ['SatellizerConfig', 'SatellizerShared', 'SatellizerStorage'];

  static Factory(SatellizerConfig: Config, SatellizerShared: Shared, SatellizerStorage: Storage): Interceptor {
    return new Interceptor(SatellizerConfig, SatellizerShared, SatellizerStorage);
  }

  constructor(private SatellizerConfig: Config,
              private SatellizerShared: Shared,
              private SatellizerStorage: Storage) {
  }

  request = (config: angular.IRequestConfig): angular.IRequestConfig => {
    if (config['skipAuthorization']) {
      return config;
    }

    if (this.SatellizerShared.isAuthenticated() && this.SatellizerConfig.httpInterceptor()) {
      const tokenName = this.SatellizerConfig.tokenPrefix ?
        [this.SatellizerConfig.tokenPrefix, this.SatellizerConfig.tokenName].join('_') : this.SatellizerConfig.tokenName;
      let token = this.SatellizerStorage.get(tokenName);

      if (this.SatellizerConfig.tokenHeader && this.SatellizerConfig.tokenType) {
        token = this.SatellizerConfig.tokenType + ' ' + token;
      }

      config.headers[this.SatellizerConfig.tokenHeader] = token;
    }

    return config;
  };
}

Interceptor.Factory.$inject = ['SatellizerConfig', 'SatellizerShared', 'SatellizerStorage'];