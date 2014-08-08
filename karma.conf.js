module.exports = function(config) {
  config.set({

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
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
    },

    coverageReporter: {
      type: 'lcov',
      dir: 'coverage',
      subdir: '.'
    }
  });
};