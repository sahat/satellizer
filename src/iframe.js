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

            iframe.addEventListener('load', function(x) {
              // if we reach here it should mean that we haven't removed
              // the iframe in __immediateAuth, which means that something -bad- happened
              // (e.g., non-existing address or iframe-deny, but this will NOT catch 404)
              $window.document.body.removeChild(iframe);
              deferred.reject({error: 'unable to load immediate auth redirect'});
            });

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
