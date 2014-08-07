module.exports = function(config) {
  config.set({

    files: [
      'angular.js',
      'angular-mocks.js',
      'lib/satellizer.js',
      'test/*.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['PhantomJS'],

    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ]

//    reporters: ['coverage'],
//
//    preprocessors: {
//      'lib/angular-auth.js': ['coverage']
//    }
  });
};