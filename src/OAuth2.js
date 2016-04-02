import url from 'url';

class OAuth2 {
  constructor($http, $window, $timeout, SatellizerConfig, SatellizerPopup, SatellizerStorage) {
    this.$http = $http;
    this.$window = $window;
    this.$timeout = $timeout;
    this.config = SatellizerConfig;
    this.popup = SatellizerPopup;
    this.storage = SatellizerStorage;

    this.defaults = {
      defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
      responseType: 'code',
      responseParams: {
        code: 'code',
        clientId: 'clientId',
        redirectUri: 'redirectUri'
      }
    };
  }

  open(options, data) {
    return new Promise((resolve, reject) => {
      Object.assign(this.defaults, options);

      this.$timeout(() => {
        const stateName = this.defaults.name + '_state'; // todo; what if name is undefined

        if (typeof this.defaults.state === 'function') {
          this.storage.set(stateName, this.defaults.state());
        } else if (typeof this.defaults.state === 'string') {
          this.storage.set(stateName, this.defaults.state);
        }

        const url = [this.defaults.authorizationEndpoint, this.buildQueryString()].join('?');
        const { name, popupOptions, redirectUri } = this.defaults;

        return this.popup.open(url, name, popupOptions, redirectUri).then((oauth) => {
          if (this.defaults.responseType === 'token' || !this.defaults.url) {
            return resolve(oauth);
          }

          if (oauth.state && oauth.state !== this.storage.get(stateName)) {
            return reject(new Error(
              'The value returned in the state parameter does not match the state value from your original ' +
              'authorization code request.'
            ));
          }

          return this.exchangeForToken(oauth, data);
        });
      });
    });
  }

  exchangeForToken(oauth, data) {
    const payload = Object.assign({}, data);

    // TODO: use this instead
    // for (const key in this.defaults.responseParams) {
    //   if (this.defaults.responseParams.hasOwnProperty(key)) {
    //     const value = this.defaults.responseParams[key];
    //
    //     switch (key) {
    //       case 'code':
    //         payload[value] = oauth.code;
    //         break;
    //       case 'clientId':
    //         payload[value] = this.defaults.clientId;
    //         break;
    //       case 'redirectUri':
    //         payload[value] = this.defaults.redirectUri;
    //         break;
    //       default:
    //         payload[value] = oauth[key];
    //     }
    //   }
    // }

    angular.forEach(this.defaults.responseParams, (value, key) => {
      switch (key) {
        case 'code':
          payload[value] = oauth.code;
          break;
        case 'clientId':
          payload[value] = this.defaults.clientId;
          break;
        case 'redirectUri':
          payload[value] = this.defaults.redirectUri;
          break;
        default:
          payload[value] = oauth[key];
      }
    });

    if (oauth.state) {
      payload.state = oauth.state;
    }

    var exchangeForTokenUrl = this.config.baseUrl ? url.resolve(this.config.baseUrl, this.defaults.url) : this.defaults.url;

    return this.$http.post(exchangeForTokenUrl, payload, { withCredentials: this.config.withCredentials });
  }

  buildQueryString() {
    const keyValuePairs = [];
    const urlParamsCategories = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];

    angular.forEach(urlParamsCategories, (paramsCategory) => {
      angular.forEach(this.defaults[paramsCategory], (paramName) => {
        const camelizedName = utils.camelCase(paramName);
        let paramValue = angular.isFunction(this.defaults[paramName]) ? this.defaults[paramName]() : this.defaults[camelizedName];

        if (paramName === 'redirect_uri' && !paramValue) { return; }

        if (paramName === 'state') {
          const stateName = this.defaults.name + '_state'; // todo what if name undefined
          paramValue = encodeURIComponent(this.storage.get(stateName));
        }

        if (paramName === 'scope' && Array.isArray(paramValue)) {
          paramValue = paramValue.join(this.defaults.scopeDelimiter);

          if (this.defaults.scopePrefix) {
            paramValue = [this.defaults.scopePrefix, paramValue].join(this.defaults.scopeDelimiter);
          }
        }

        keyValuePairs.push([paramName, paramValue]);
      });
    });

    return keyValuePairs.map(pair => pair.join('=')).join('&');
  }

  camelCase(name) {
    return name.replace(/([\:\-\_]+(.))/g, function(_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    });
  }
}

export default OAuth2;
