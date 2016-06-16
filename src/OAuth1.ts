import { resolve } from 'url';
import Config from './Config';
import Popup from './Popup';

class OAuth1 {
  static $inject = ['$http', '$window'];

  private defaults: {
    url: string,
    redirectUri: string
  };

  constructor(private $http: angular.IHttpService,
              private $window: angular.IWindowService,
              private config: Config,
              private popup: Popup) {
    this.defaults = {
      url: null,
      redirectUri: null
    };
  }

  init(options, data) {
    const { name, popupOptions, redirectUri } = options;

    let popupWindow;

    if (!this.$window['cordova']) {
      popupWindow = this.popup.open('about:blank', name, popupOptions, redirectUri);
    }

    return this.getRequestToken().then((response) => {
      const url = [options.authorizationEndpoint, this.buildQueryString(response.data)].join('?');

      if (this.$window['cordova']) {
        popupWindow = this.popup.open(url, name, popupOptions, redirectUri);
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

  getRequestToken() {
    const url = this.config.baseUrl ? resolve(this.config.baseUrl, this.defaults.url) : this.defaults.url;
    return this.$http.post(url, this.defaults);
  }

  exchangeForToken(oauth, data) {
    const payload = Object.assign({}, data, oauth);
    const exchangeForTokenUrl = this.config.baseUrl ? resolve(this.config.baseUrl, this.defaults.url) : this.defaults.url;
    return this.$http.post(exchangeForTokenUrl, payload, { withCredentials: this.config.withCredentials });
  }

  buildQueryString(obj) {
    const str = [];
    angular.forEach(obj, function (value, key) {
      str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    });
    return str.join('&');
  }
}

export default OAuth1;
