import typescript from 'rollup-plugin-typescript';
const version = require('./package.json').version;

export default {
  entry: 'src/ng1.ts',
  dest: 'dist/satellizer.js',
  sourceMap: 'dist/satellizer.map',
  banner: '/**\n * Satellizer ' + version + '\n * (c) 2016 Sahat Yalkabov \n * License: MIT \n */\n',
  format: 'umd',
  moduleName: 'satellizer',
  plugins: [
    typescript()
  ]
}
