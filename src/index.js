/**
 * Satellizer
 * (c) 2014 Sahat Yalkabov
 * License: MIT
 */

angular.module('satellizer', [])
  .config(['$httpProvider', 'satellizer.config', function($httpProvider, config) {
    if (config.httpInterceptor) {
      $httpProvider.interceptors.push('satellizerInterceptor');
    }
  }]);
