module.exports = function(config) {
  config.set({

    files: [
      'http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.0-beta.13/angular.js',
      'http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.0-beta.13/angular-mocks.js',
      'lib/satellizer.js',
      'test/*.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['PhantomJS'],

    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-coverage'
    ],

    reporters: ['progress', 'coverage'],

    preprocessors: {
      'lib/satellizer.js': ['coverage']
    }
  });
};