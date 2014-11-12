angular.module('satellizer')
  .factory('satellizer.popup', [
    '$q',
    '$interval',
    '$window',
    '$location',
    'satellizer.utils',
    function($q, $interval, $window, $location, utils) {
      var popupWindow = null;
      var polling = null;

      var popup = {};

      popup.popupWindow = popupWindow;

      popup.open = function(url, options) {
        var optionsString = popup.stringifyOptions(popup.prepareOptions(options || {}));

        popupWindow = window.open(url, '_blank', optionsString);

        if (popupWindow && popupWindow.focus) {
          popupWindow.focus();
        }

        return popup.pollPopup();
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
