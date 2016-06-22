import { resolve } from 'url';
import Config from './config';
import Popup from './popup';

interface IOAuth1 {
  init(options: any, data: any): angular.IPromise<any>;
}

export default class OAuth1 implements IOAuth1 {
  static $inject = ['$http', '$window', 'satellizerConfig', 'satellizerPopup'];
  
  private defaults: {
    url: string,
    redirectUri: string
  };

  constructor(private $http: angular.IHttpService,
              private $window: angular.IWindowService,
              private satellizerConfig: Config,
              private satellizerPopup: Popup) {
    this.defaults = {
      url: null,
      redirectUri: null
    };
  }

  init(options, data): angular.IHttpPromise<any> {
    const { name, popupOptions, redirectUri } = options;

    let popupWindow;

    if (!this.$window['cordova']) {
      popupWindow = this.satellizerPopup.open('about:blank', name, popupOptions, redirectUri);
    }

    return this.getRequestToken().then((response) => {
      const url = [options.authorizationEndpoint, this.buildQueryString(response.data)].join('?');

      if (this.$window['cordova']) {
        popupWindow = this.satellizerPopup.open(url, name, popupOptions, redirectUri);
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
        return this.exchangeForToken(popupResponse, data);
      });
    });

  }

  getRequestToken(): angular.IHttpPromise<any> {
    const url = this.satellizerConfig.baseUrl ? resolve(this.satellizerConfig.baseUrl, this.defaults.url) : this.defaults.url;
    return this.$http.post(url, this.defaults);
  }

  exchangeForToken(oauth, data): angular.IHttpPromise<any> {
    const payload = Object.assign({}, data, oauth);
    const exchangeForTokenUrl = this.satellizerConfig.baseUrl ? resolve(this.satellizerConfig.baseUrl, this.defaults.url) : this.defaults.url;
    return this.$http.post(exchangeForTokenUrl, payload, { withCredentials: this.satellizerConfig.withCredentials });
  }

  buildQueryString(obj): string {
    const str = [];
    angular.forEach(obj, function (value, key) {
      str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    });
    return str.join('&');
  }
}
