import { joinUrl } from './utils';
import Config from './config';
import Popup from './popup';
import { IOAuth1Options } from './interface';

export interface IOAuth1 {
  init(options: any, data: any): angular.IPromise<any>;
}

export default class OAuth1 implements IOAuth1 {
  static $inject = ['$http', '$window', 'SatellizerConfig', 'SatellizerPopup'];
  
  private defaults: IOAuth1Options;

  constructor(private $http: angular.IHttpService,
              private $window: angular.IWindowService,
              private SatellizerConfig: Config,
              private SatellizerPopup: Popup) {
    this.defaults = {
      name: null,
      url: null,
      authorizationEndpoint: null,
      scope: null,
      scopePrefix: null,
      scopeDelimiter: null,
      redirectUri: null,
      requiredUrlParams: null,
      defaultUrlParams: null,
      oauthType: '1.0',
      popupOptions: { width: null, height: null }
    };
  };

  init(options: IOAuth1Options, userData: any): angular.IHttpPromise<any> {
    const { name, popupOptions, redirectUri } = options;

    let popupWindow;

    if (!this.$window['cordova']) {
      popupWindow = this.SatellizerPopup.open('about:blank', name, popupOptions, redirectUri);
    }

    return this.getRequestToken().then((response) => {
      const url = [options.authorizationEndpoint, this.buildQueryString(response.data)].join('?');

      if (this.$window['cordova']) {
        popupWindow = this.SatellizerPopup.open(url, name, popupOptions, redirectUri);
      } else {
        popupWindow.popupWindow.location = url;
      }

      let popupListener;

      if (this.$window['cordova']) {
        popupListener = popupWindow.eventListener(this.defaults.redirectUri);
      } else {
        popupListener = popupWindow.pollPopup(this.defaults.redirectUri);
      }

      return popupListener.then((popupResponse) => {
        return this.exchangeForToken(popupResponse, userData);
      });
    });

  }

  getRequestToken(): angular.IHttpPromise<any> {
    const url = this.SatellizerConfig.baseUrl ? joinUrl(this.SatellizerConfig.baseUrl, this.defaults.url) : this.defaults.url;
    return this.$http.post(url, this.defaults);
  }

  exchangeForToken(oauth, userData): angular.IHttpPromise<any> {
    const payload = Object.assign({}, userData, oauth);
    const exchangeForTokenUrl = this.SatellizerConfig.baseUrl ? joinUrl(this.SatellizerConfig.baseUrl, this.defaults.url) : this.defaults.url;
    return this.$http.post(exchangeForTokenUrl, payload, { withCredentials: this.SatellizerConfig.withCredentials });
  }

  buildQueryString(obj): string {
    const str = [];
    angular.forEach(obj, function (value, key) {
      str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    });
    return str.join('&');
  }
}
