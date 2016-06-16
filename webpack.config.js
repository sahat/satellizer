var webpack = require('webpack');
var path = require('path');
var pkg = require('./package.json');

var banner = pkg.description + '\n' +
  '@version v' + pkg.version + '\n' +
  '@link ' + pkg.homepage + '\n' +
  '@license MIT License, http://www.opensource.org/licenses/MIT';

module.exports = {
  // devtool: 'source-map',

  entry: './dist/NG1.js',

  output: {
    filename: 'satellizer.js',
    path: path.join(__dirname, 'examples', 'client', 'vendor'),
    library: 'satellizer',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   include: /.js$/, minimize: true
    // }),
    new webpack.BannerPlugin(banner)
  ],

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  }
};
