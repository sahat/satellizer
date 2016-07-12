import { joinUrl } from './utils';
import Config from './config';
import Shared from './shared';

class Local {
  static $inject = ['$http', 'SatellizerConfig', 'SatellizerShared'];


  constructor(private $http: angular.IHttpService,
              private SatellizerConfig: Config,
              private SatellizerShared: Shared) {}

  login(user: string|Object, options: any = {}): angular.IHttpPromise<any> {
    options.url = options.url ? options.url : joinUrl(this.SatellizerConfig.baseUrl, this.SatellizerConfig.loginUrl);
    options.data = user || options.data;
    options.method = options.method || 'POST';
    options.withCredentials = options.withCredentials || this.SatellizerConfig.withCredentials;

    return this.$http(options).then((response) => {
      this.SatellizerShared.setToken(response);
      return response;
    });
  }

  signup(user: string|Object, options: any = {}): angular.IHttpPromise<any> {
    options.url = options.url ? options.url : joinUrl(this.SatellizerConfig.baseUrl, this.SatellizerConfig.signupUrl);
    options.data = user || options.data;
    options.method = options.method || 'POST';
    options.withCredentials = options.withCredentials || this.SatellizerConfig.withCredentials;

    return this.$http(options);
  }
}

export default Local;
