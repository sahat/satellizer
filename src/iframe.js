angular.module('satellizer')
  .factory('satellizer.iframe', [
    '$q',
    '$window',
    'satellizer.utils',
      function ($q, $window, utils) {
        return {
          open: function (url) {
            var iframe = $window.document.createElement('iframe');
            iframe.hidden = true;
            iframe.src = url;

            var deferred = $q.defer();
            $window.__immediateAuth = function (location) {
              $window.document.body.removeChild(iframe);
              delete $window.__immediateAuth;
              var qs = utils.parseLocationString(location);

              if (qs.error) {
                deferred.reject({error: qs.error});
              } else {
                deferred.resolve(qs);
              }
            };

            $window.document.body.appendChild(iframe);

            return deferred.promise;
          }
        };
      }]);
