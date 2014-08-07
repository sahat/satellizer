module.exports = function(config) {
  config.set({

    basePath: '../',

    files: [
      '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.0-beta.13/angular.js',
      '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.0-beta.13/angular-mocks.js',
      'lib/satellizer.js',
      'test/unit/*.js'
    ],

    autoWatch: false,

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