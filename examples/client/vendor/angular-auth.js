/**
 * (c) 2014 Sahat Yalkabov <sahat@me.com>
 * License: MIT
 */

(function(window, angular, undefined) {
  angular.module('ngAuth', [])
    .provider('$auth', function() {
      var config = {
        apiUrl: '/api',
        signOutUrl: '/auth/sign_out',
        emailSignInPath: '/auth/sign_in',
        emailRegistrationPath: '/auth',
        confirmationSuccessUrl: window.location.href,
        tokenValidationPath: '/auth/validate_token',
        proxyIf: function() {
          return false;
        },
        proxyUrl: '/proxy',
        authProviderPaths: {
          github: '/auth/github',
          facebook: '/auth/facebook',
          google: '/auth/google_oauth2'
        }
      }
    })
    .directive('ngMessages', ['$compile', '$animate', '$http', '$templateCache',
      function($compile,    $animate,   $http,   $templateCache) {
        var ACTIVE_CLASS = 'ng-active';
        var INACTIVE_CLASS = 'ng-inactive';

        return {
          restrict: 'AE',
          controller: function($scope) {
            this.$renderNgMessageClasses = angular.noop;

            var messages = [];
            this.registerMessage = function(index, message) {
              for(var i = 0; i < messages.length; i++) {
                if(messages[i].type == message.type) {
                  if(index != i) {
                    var temp = messages[index];
                    messages[index] = messages[i];
                    if(index < messages.length) {
                      messages[i] = temp;
                    } else {
                      messages.splice(0, i); //remove the old one (and shift left)
                    }
                  }
                  return;
                }
              }
              messages.splice(index, 0, message); //add the new one (and shift right)
            };

            this.renderMessages = function(values, multiple) {
              values = values || {};

              var found;
              angular.forEach(messages, function(message) {
                if((!found || multiple) && truthyVal(values[message.type])) {
                  message.attach();
                  found = true;
                } else {
                  message.detach();
                }
              });

              this.renderElementClasses(found);

              function truthyVal(value) {
                return value !== null && value !== false && value;
              }
            };
          },
          require: 'ngMessages',
          link: function($scope, element, $attrs, ctrl) {
            ctrl.renderElementClasses = function(bool) {
              bool ? $animate.setClass(element, ACTIVE_CLASS, INACTIVE_CLASS)
                : $animate.setClass(element, INACTIVE_CLASS, ACTIVE_CLASS);
            };

            //JavaScript treats empty strings as false, but ng-message-multiple by itself is an empty string
            var multiple = angular.isString($attrs.ngMessagesMultiple) ||
              angular.isString($attrs.multiple);

            var cachedValues, watchAttr = $attrs.ngMessages || $attrs['for']; //for is a reserved keyword
            $scope.$watchCollection(watchAttr, function(values) {
              cachedValues = values;
              ctrl.renderMessages(values, multiple);
            });

            var tpl = $attrs.ngMessagesInclude || $attrs.include;
            if(tpl) {
              $http.get(tpl, { cache: $templateCache })
                .success(function processTemplate(html) {
                  var after, container = angular.element('<div/>').html(html);
                  angular.forEach(container.children(), function(elm) {
                    elm = angular.element(elm);
                    after ? after.after(elm)
                      : element.prepend(elm); //start of the container
                    after = elm;
                    $compile(elm)($scope);
                  });
                  ctrl.renderMessages(cachedValues, multiple);
                });
            }
          }
        };
      }])


    .directive('ngMessage', ['$animate', function($animate) {
      var COMMENT_NODE = 8;
      return {
        require: '^ngMessages',
        transclude: 'element',
        terminal: true,
        restrict: 'AE',
        link: function($scope, $element, $attrs, ngMessages, $transclude) {
          var index, element;

          var commentNode = $element[0];
          var parentNode = commentNode.parentNode;
          for(var i = 0, j = 0; i < parentNode.childNodes.length; i++) {
            var node = parentNode.childNodes[i];
            if(node.nodeType == COMMENT_NODE && node.nodeValue.indexOf('ngMessage') >= 0) {
              if(node === commentNode) {
                index = j;
                break;
              }
              j++;
            }
          }

          ngMessages.registerMessage(index, {
            type : $attrs.ngMessage || $attrs.when,
            attach : function() {
              if(!element) {
                $transclude($scope, function(clone) {
                  $animate.enter(clone, null, $element);
                  element = clone;
                });
              }
            },
            detach : function(now) {
              if(element) {
                $animate.leave(element);
                element = null;
              }
            }
          });
        }
      };
    }]);


})(window, window.angular);
