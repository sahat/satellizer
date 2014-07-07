module.exports = function(config) {
  config.set({

    basePath: '../',

    files: [
      'examples/client/vendor/angular.js',
      'examples/client/vendor/angular-mocks.js',
      'src/angular-auth.js',
      'test/*.spec.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine'
    ]

  });
};