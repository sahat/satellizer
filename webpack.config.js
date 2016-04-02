var pkg = require('./package.json');
var banner = pkg.description + '\n' +
  '@version v' + pkg.version + '\n' +
  '@link ' + pkg.homepage + '\n' +
  '@license MIT License, http://www.opensource.org/licenses/MIT';

var webpack = require('webpack');

module.exports = {
  entry: {
    "satellizer": "./src/ng1.js"
  },

  output: {
    library: 'satellizer',
    libraryTarget: 'umd'
  },

  devtool: 'source-map',

  resolve: {
    extensions: ['', '.js']
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/, minimize: true
    }),
    new webpack.BannerPlugin(banner)
  ],

  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/
    }]
  }
};
