import { resolve } from 'url';
import Config from './config';
import Shared from './shared';

class Local {
  static $inject = ['$http', 'satellizerConfig', 'satellizerShared'];

  constructor(private $http: angular.IHttpService,
              private satellizerConfig: Config,
              private satellizerShared: Shared) {}

  login(user, options): angular.IHttpPromise<any> {
    options.url = options.url ? options.url : resolve(this.satellizerConfig.baseUrl, this.satellizerConfig.loginUrl);
    options.data = user || options.data;
    options.method = options.method || 'POST';
    options.withCredentials = options.withCredentials || this.satellizerConfig.withCredentials;

    return this.$http(options).then((response) => {
      this.satellizerShared.setToken(response);
      return response;
    });
  }

  signup(user, options): angular.IHttpPromise<any> {
    options = options || {};
    options.url = options.url ? options.url : resolve(this.satellizerConfig.baseUrl, this.satellizerConfig.signupUrl);
    options.data = user || options.data;
    options.method = options.method || 'POST';
    options.withCredentials = options.withCredentials || this.satellizerConfig.withCredentials;

    return this.$http(options);
  }
}

export default Local;
