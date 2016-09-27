import typescript from 'rollup-plugin-typescript';
const version = require('./package.json').version;

export default {
  entry: 'src/ng1.ts',
  dest: 'dist/satellizer-roles.js',
  sourceMap: 'dist/satellizer-roles.map',
  banner: '/**\n * Satellizer-Roles ' + version + '\n * (c) 2016 Chris Newell \n * License: MIT \n */\n',
  format: 'umd',
  moduleName: 'satellizerRoles',
  plugins: [
    typescript()
  ]
};
