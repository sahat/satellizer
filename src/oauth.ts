import { joinUrl } from './utils';
import Config from './config';
import Shared from './shared';
import OAuth1 from './oauth1';
import OAuth2 from './oauth2';

export default class OAuth {
  static $inject = ['$http', 'SatellizerConfig', 'SatellizerShared', 'SatellizerOAuth1', 'SatellizerOAuth2'];
  
  constructor(private $http: angular.IHttpService,
              private SatellizerConfig: Config,
              private SatellizerShared: Shared,
              private SatellizerOAuth1: OAuth1,
              private SatellizerOAuth2: OAuth2) {
  }

  authenticate(name: string, userData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const provider = this.SatellizerConfig.providers[name];
      const initialize: any = provider.oauthType === '1.0' ? this.SatellizerOAuth1.init(provider, userData) : this.SatellizerOAuth2.init(provider, userData);

      return initialize.then((response) => {
        if (provider.url) {
          this.SatellizerShared.setToken(response);
        }
        resolve(response);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  unlink(provider: string, httpOptions: any = {}): angular.IHttpPromise<any> {
    httpOptions.url = httpOptions.url ? httpOptions.url : joinUrl(this.SatellizerConfig.baseUrl, this.SatellizerConfig.unlinkUrl);
    httpOptions.data = { provider: provider } || httpOptions.data;
    httpOptions.method = httpOptions.method || 'POST';
    httpOptions.withCredentials = httpOptions.withCredentials || this.SatellizerConfig.withCredentials;

    return this.$http(httpOptions);
  }
}
