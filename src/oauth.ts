import { resolve } from 'url';
import Config from './config';
import Shared from './shared';
import OAuth1 from './oauth1';
import OAuth2 from './oauth2';

export default class OAuth {
  static $inject = ['$http', 'satellizerConfig', 'satellizerShared', 'satellizerOAuth1', 'satellizerOAuth2'];
  
  constructor(private $http: angular.IHttpService,
              private satellizerConfig: Config,
              private satellizerShared: Shared,
              private satellizerOAuth1: OAuth1,
              private satellizerOAuth2: OAuth2) {
  }

  authenticate(name, data): Promise<any> {
    return new Promise((resolve, reject) => {
      const provider = this.satellizerConfig.providers[name];
      const initialize: any = provider.oauthType === '1.0' ? this.satellizerOAuth1.init(provider, data) : this.satellizerOAuth2.init(provider, data);

      return initialize.then((response) => {
        if (provider.url) {
          this.satellizerShared.setToken(response);
        }
        resolve(response);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  unlink(provider, httpOptions): angular.IHttpPromise<any> {
    httpOptions.url = httpOptions.url ? httpOptions.url : resolve(this.satellizerConfig.baseUrl, this.satellizerConfig.unlinkUrl);
    httpOptions.data = { provider } || httpOptions.data;
    httpOptions.method = httpOptions.method || 'POST';
    httpOptions.withCredentials = httpOptions.withCredentials || this.satellizerConfig.withCredentials;

    return this.$http(httpOptions);
  }
}
