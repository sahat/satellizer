angular.module('satellizer')
  .factory('satellizer.Oauth2', [
    '$q',
    '$http',
    'satellizer.popup',
    'satellizer.iframe',
    'satellizer.utils',
    'satellizer.config',
    function($q, $http, popup, iframe, utils, config) {
      return function() {

        var defaults = {
          url: null,
          name: null,
          scope: null,
          scopeDelimiter: null,
          clientId: null,
          redirectUri: null,
          popupOptions: null,
          authorizationEndpoint: null,
          requiredUrlParams: null,
          optionalUrlParams: null,
          defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
          responseType: 'code'
        };
        var sharedOptions;

        var oauth2 = {};

        oauth2.open = function(options, userData, immediate) {
          angular.extend(sharedOptions = {}, defaults , options);
          if (immediate) {
            delete sharedOptions.display;
            sharedOptions.prompt = 'none';
            sharedOptions.redirectUri = (window.location.origin || window.location.protocol + '//' + window.location.host)
                                  + config.immediateRedirect;
            sharedOptions.defaultUrlParams.push('prompt');
          }
          var url = oauth2.buildUrl(immediate);

          var subWindow;
          if (immediate) {
            subWindow = iframe.open(url);
          } else {
            subWindow = popup.open(url, sharedOptions.popupOptions);
          }
          return subWindow.then(function(oauthData) {
              if (sharedOptions.responseType === 'token') {
                return oauthData;
              } else {
                return oauth2.exchangeForToken(oauthData, userData)
              }
            });

        };

        oauth2.exchangeForToken = function(oauthData, userData) {
          var data = angular.extend({}, userData, {
            code: oauthData.code,
            clientId: sharedOptions.clientId,
            redirectUri: sharedOptions.redirectUri
          });

          return $http.post(sharedOptions.url, data);
        };

        oauth2.buildUrl = function(immediate) {
          var baseUrl = sharedOptions.authorizationEndpoint;
          var qs = oauth2.buildQueryString(immediate);
          return baseUrl + '?' + qs;
        };

        oauth2.buildQueryString = function(immediate) {
          var keyValuePairs = [];
          var urlParams = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];

          angular.forEach(urlParams, function(params) {
            angular.forEach(sharedOptions[params], function(paramName) {
              var camelizedName = utils.camelCase(paramName);
              var paramValue = sharedOptions[camelizedName];

              if (paramName === 'scope' && Array.isArray(paramValue)) {
                paramValue = paramValue.join(sharedOptions.scopeDelimiter);

                if (sharedOptions.scopePrefix) {
                  paramValue = [sharedOptions.scopePrefix, paramValue].join(sharedOptions.scopeDelimiter);
                }
              }

              if (typeof(paramValue) !== 'undefined') {
                keyValuePairs.push([paramName, paramValue]);
              }
            });
          });

          return keyValuePairs.map(function(pair) {
            return pair.join('=');
          }).join('&');
        };

        return oauth2;
      };
    }]);
