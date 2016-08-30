import { joinUrl } from './utils';
import Config from './config';
import Popup from './popup';
import Storage from './storage';

export interface IOAuth2Options {
  name: string;
  url: string;
  clientId: string;
  authorizationEndpoint: string;
  redirectUri: string;
  scope: string[];
  scopePrefix: string;
  scopeDelimiter: string;
  state?: string|(() => string);
  requiredUrlParams: string[];
  defaultUrlParams: string[];
  responseType: string;
  responseParams: {
    code: string,
    clientId: string,
    redirectUri: string
  };
  oauthType: string;
  popupOptions: { width: number, height: number };
}

export default class OAuth2 {
  static $inject = ['$http', '$window', '$timeout', '$q', 'SatellizerConfig', 'SatellizerPopup', 'SatellizerStorage'];

  static camelCase(name): string {
    return name.replace(/([\:\-\_]+(.))/g, (_, separator, letter, offset) => {
      return offset ? letter.toUpperCase() : letter;
    });
  }

  public defaults: IOAuth2Options;

  constructor(private $http: angular.IHttpService,
              private $window: angular.IWindowService,
              private $timeout: angular.ITimeoutService,
              private $q: angular.IQService,
              private SatellizerConfig: Config,
              private SatellizerPopup: Popup,
              private SatellizerStorage: Storage) {

    this.defaults = {
      name: null,
      url: null,
      clientId: null,
      authorizationEndpoint: null,
      redirectUri: null,
      scope: null,
      scopePrefix: null,
      scopeDelimiter: null,
      state: null,
      requiredUrlParams: null,
      defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
      responseType: 'code',
      responseParams: {
        code: 'code',
        clientId: 'clientId',
        redirectUri: 'redirectUri'
      },
      oauthType: '2.0',
      popupOptions: { width: null, height: null }
    };
  }

  init(options: IOAuth2Options, userData: any): angular.IPromise<any> {
    return this.$q((resolve, reject) => {
      angular.extend(this.defaults, options);

      const stateName = this.defaults.name + '_state';
      const { name, state, popupOptions, redirectUri, responseType } = this.defaults;

      if (typeof state === 'function') {
        this.SatellizerStorage.set(stateName, state());
      } else if (typeof state === 'string') {
        this.SatellizerStorage.set(stateName, state);
      }

      const url = [this.defaults.authorizationEndpoint, this.buildQueryString()].join('?');

      this.SatellizerPopup.open(url, name, popupOptions, redirectUri).then((oauth: any): void|angular.IPromise<any>|angular.IHttpPromise<any> => {
        if (responseType === 'token' || !url) {
          return resolve(oauth);
        }

        if (oauth.state && oauth.state !== this.SatellizerStorage.get(stateName)) {
          return reject(new Error(
            'The value returned in the state parameter does not match the state value from your original ' +
            'authorization code request.'
          ));
        }

        resolve(this.exchangeForToken(oauth, userData));
      }).catch(error => reject(error));
    });
  }

  exchangeForToken(oauthData: { code?, state? }, userData: any): angular.IHttpPromise<any> {
    const payload = angular.extend({}, userData);

    angular.forEach(this.defaults.responseParams, (value, key) => {
      switch (key) {
        case 'code':
          payload[value] = oauthData.code;
          break;
        case 'clientId':
          payload[value] = this.defaults.clientId;
          break;
        case 'redirectUri':
          payload[value] = this.defaults.redirectUri;
          break;
        default:
          payload[value] = oauthData[key];
      }
    });

    if (oauthData.state) {
      payload.state = oauthData.state;
    }

    let exchangeForTokenUrl = this.SatellizerConfig.baseUrl ?
      joinUrl(this.SatellizerConfig.baseUrl, this.defaults.url) :
      this.defaults.url;

    return this.$http.post(exchangeForTokenUrl, payload, { withCredentials: this.SatellizerConfig.withCredentials });
  }

  buildQueryString(): string {
    const keyValuePairs = [];
    const urlParamsCategories = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];

    angular.forEach(urlParamsCategories, (paramsCategory) => {
      angular.forEach(this.defaults[paramsCategory], (paramName) => {
        const camelizedName = OAuth2.camelCase(paramName);
        let paramValue = angular.isFunction(this.defaults[paramName]) ? this.defaults[paramName]() : this.defaults[camelizedName];

        if (paramName === 'redirect_uri' && !paramValue) {
          return;
        }
        if (paramName === 'state') {
          const stateName = this.defaults.name + '_state';
          paramValue = encodeURIComponent(this.SatellizerStorage.get(stateName));
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
}
