module.exports = function(config) {
  config.set({

    basePath: '../',

    files: [
      'demo/client/bower_components/angular/angular.js',
      'demo/client/bower_components/angular-mocks/angular-mocks.js',
      'lib/angular-auth.js',
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