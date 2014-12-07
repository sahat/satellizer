angular.module('satellizer')
  .factory('satellizer.popup', [
    '$q',
    '$interval',
    '$window',
    '$location',
    'satellizer.config',
    'satellizer.utils',
    function($q, $interval, $window, $location, config, utils) {
      var popupWindow = null;
      var polling = null;

      var popup = {};

      popup.popupWindow = popupWindow;

      popup.open = function(url, options, redirectUri) {
        var optionsString = popup.stringifyOptions(popup.prepareOptions(options || {}));

        popupWindow = window.open(url, '_blank', optionsString);

        if (popupWindow && popupWindow.focus) {
          popupWindow.focus();
        }

	if (config.platform === 'mobile') {
          return popup.eventListener(redirectUri);
        }

        return popup.pollPopup();
      };

      popup.eventListener = function(redirectUri) {
        var deferred = $q.defer();

        popupWindow.addEventListener('loadstart', function(event) {
          if (event.url.indexOf(redirectUri) !== 0) {
            return;
          }

          var parser = document.createElement('a');

          parser.href = event.url;

          var queryParams = parser.search.substring(1).replace(/\/$/, '');
          var hashParams = parser.hash.substring(1).replace(/\/$/, '');
          var hash = utils.parseQueryString(hashParams);
          var qs = utils.parseQueryString(queryParams);

          angular.extend(qs, hash);

          if (qs.error) {
            deferred.reject({ error: qs.error });
          } else {
            deferred.resolve({ code: qs.code });
          }

          popupWindow.close();
        });

        return deferred.promise;
      };

      popup.pollPopup = function() {
        var deferred = $q.defer();
        polling = $interval(function() {
	  try {
	    if (popupWindow.document.domain === document.domain && (popupWindow.location.search || popupWindow.location.hash)) {
	      var queryParams = popupWindow.location.search.substring(1).replace(/\/$/, '');
	      var hashParams = popupWindow.location.hash.substring(1).replace(/\/$/, '');
	      var hash = utils.parseQueryString(hashParams);
	      var qs = utils.parseQueryString(queryParams);

	      angular.extend(qs, hash);

	      if (qs.error) {
		deferred.reject({ error: qs.error });
	      } else {
		deferred.resolve(qs);
	      }

	      popupWindow.close();
	      $interval.cancel(polling);
	    }
	  } catch (error) {
	  }

	  if (popupWindow.closed) {
	    $interval.cancel(polling);
	    deferred.reject({ data: 'Authorization Failed' });
	  }
        }, 35);
        return deferred.promise;
      };

      popup.prepareOptions = function(options) {
        var width = options.width || 500;
        var height = options.height || 500;
        return angular.extend({
          width: width,
          height: height,
          left: $window.screenX + (($window.outerWidth - width) / 2),
          top: $window.screenY + (($window.outerHeight - height) / 2.5)
        }, options);
      };

      popup.stringifyOptions = function(options) {
        var parts = [];
        angular.forEach(options, function(value, key) {
          parts.push(key + '=' + value);
        });
        return parts.join(',');
      };

      return popup;
    }]);
