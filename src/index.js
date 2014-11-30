/**
 * Satellizer
 * (c) 2014 Sahat Yalkabov
 * License: MIT
 */

angular.module('satellizer', [])
  .config([
    '$httpProvider',
    function($httpProvider) {
      $httpProvider.interceptors.push('satellizer.interceptor');
    }]);
