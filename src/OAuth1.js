import url from 'url';

class OAuth1 {
  constructor($http, $window, SatellizerConfig, SatellizerPopup) {
    this.$http = $http;
    this.$window = $window;
    this.config = SatellizerConfig;
    this.popup = SatellizerPopup;

    // todo clean up or include every field here
    this.defaults = {
      url: null, // todo ???
      name: null,
      popupOptions: null,
      redirectUri: null,
      authorizationEndpoint: null
    };
  }

  open(options, data) {
    Object.assign(this.defaults, options);

    var popupWindow;
    const { name, popupOptions, redirectUri } = this.defaults;


    if (!this.$window.cordova) {
      popupWindow = this.popup.open('about:blank', name, popupOptions, redirectUri);
    }


    return this.getRequestToken().then((response) => {
      const url = [this.defaults.authorizationEndpoint, this.buildQueryString(response.data)].join('?');

      if (this.$window.cordova) {
        popupWindow = this.popup.open(url, name, popupOptions, redirectUri);
      } else {
        popupWindow.popupWindow.location = url;
      }

      var popupListener;

      if (this.$window.cordova) {
        popupListener = popupWindow.eventListener(this.defaults.redirectUri);
      } else {
        popupListener = popupWindow.pollPopup(this.defaults.redirectUri);
      }

      return popupListener.then(function(response) {
          return Oauth1.exchangeForToken(response, data);
        });
    });

  }

  getRequestToken() {
    const url = this.config.baseUrl ? url.resolve(this.config.baseUrl, this.defaults.url) : this.defaults.url;
    return this.$http.post(url, this.defaults);
  }

  exchangeForToken(oauth, data) {
    const payload = Object.assign({}, data, oauth);
    const exchangeForTokenUrl = this.config.baseUrl ? url.resolve(this.config.baseUrl, this.defaults.url) : this.defaults.url;
    return $http.post(exchangeForTokenUrl, payload, { withCredentials: this.config.withCredentials });
  }

  buildQueryString(obj) {
    const str = [];
    angular.forEach(obj, function(value, key) {
      str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    });
    return str.join('&');
  }
}

export default OAuth1;
