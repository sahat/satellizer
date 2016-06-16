import { resolve } from 'url';
import Config from './Config';
import Shared from './Shared';

class Local {
  static $inject = ['$http'];

  constructor(private $http: angular.IHttpService,
              private config: Config,
              private shared: Shared) {}

  login(user, options: any = {}) {
    options.url = options.url ? options.url : resolve(this.config.baseUrl, this.config.loginUrl);
    options.data = user || options.data;
    options.method = options.method || 'POST';
    options.withCredentials = options.withCredentials || this.config.withCredentials;

    return this.$http(options).then((response) => {
      this.shared.setToken(response);
      return response;
    });
  }

  signup(user, options: any = {}) {
    options = options || {};
    options.url = options.url ? options.url : resolve(this.config.baseUrl, this.config.signupUrl);
    options.data = user || options.data;
    options.method = options.method || 'POST';
    options.withCredentials = options.withCredentials || this.config.withCredentials;

    return this.$http(options);
  }
}

export default Local;
