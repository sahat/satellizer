import { joinUrl } from './utils';
import Config from './config';
import Popup from './popup';
import Storage from './storage';
import Shared from './shared';
import OAuth1 from './oauth1';
import OAuth2 from './oauth2';

export default class OAuth {
  static $inject = [
    '$http',
    '$window',
    '$timeout',
    '$q',
    'SatellizerConfig',
    'SatellizerPopup',
    'SatellizerStorage',
    'SatellizerShared',
    'SatellizerOAuth1',
    'SatellizerOAuth2'
  ];

  constructor(private $http: angular.IHttpService,
              private $window: angular.IWindowService,
              private $timeout: angular.ITimeoutService,
              private $q: angular.IQService,
              private SatellizerConfig: Config,
              private SatellizerPopup: Popup,
              private SatellizerStorage: Storage,
              private SatellizerShared: Shared,
              private SatellizerOAuth1: OAuth1,
              private SatellizerOAuth2: OAuth2) {}

  authenticate(name: string, userData?: any): angular.IPromise<any> {
    return this.$q((resolve, reject) => {
      const provider = this.SatellizerConfig.providers[name];

      let oauth = null;

      switch (provider.oauthType) {
        case '1.0':
          oauth = new OAuth1(this.$http, this.$window, this.SatellizerConfig, this.SatellizerPopup);
          break;
        case '2.0':
          oauth = new OAuth2(this.$http, this.$window, this.$timeout, this.$q, this.SatellizerConfig, this.SatellizerPopup, this.SatellizerStorage);
          break;
        default:
          return reject(new Error('Invalid OAuth Type'));
      }

      return oauth.init(provider, userData).then((response) => {
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
