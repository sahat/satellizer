import { resolve } from 'url';
import Config from './Config';
import Shared from './Shared';

class Local {
  constructor(private $http: angular.IHttpService,
              private satellizerConfig: Config,
              private satellizerShared: Shared) {}

  login(user, options: any = {}) {
    options.url = options.url ? options.url : resolve(this.satellizerConfig.baseUrl, this.satellizerConfig.loginUrl);
    options.data = user || options.data;
    options.method = options.method || 'POST';
    options.withCredentials = options.withCredentials || this.satellizerConfig.withCredentials;

    return this.$http(options).then((response) => {
      this.satellizerShared.setToken(response);
      return response;
    });
  }

  signup(user, options: any = {}) {
    options = options || {};
    options.url = options.url ? options.url : resolve(this.satellizerConfig.baseUrl, this.satellizerConfig.signupUrl);
    options.data = user || options.data;
    options.method = options.method || 'POST';
    options.withCredentials = options.withCredentials || this.satellizerConfig.withCredentials;

    return this.$http(options);
  }
}

export default Local;
