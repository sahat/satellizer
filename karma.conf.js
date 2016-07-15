module.exports = function (config) {
  config.set({
    files: [
      'test/*.spec.ts'
    ],

    browsers: ['PhantomJS'],

    frameworks: ['jasmine'],

    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-coverage',
      'karma-webpack'
    ],

    singleRun: true,

    autoWatch: false,

    reporters: ['dots'],

    preprocessors: {
      'test/*.spec.ts': ['webpack']
    },

    webpack: {
      resolve: {
        extensions: ['', '.ts', '.js']
      },
      module: {
        loaders: [
          { test: /\.ts$/, loader: 'ts' }
        ]
      }
    },

    webpackMiddleware: {
      noInfo: true
    }
  });
};
