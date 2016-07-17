import typescript from 'rollup-plugin-typescript';

export default {
  entry: 'src/ng1.ts',
  dest: 'dist/satellizer.js',
  sourceMap: 'dist/satellizer.map',
  format: 'umd',
  moduleName: 'satellizer',
  plugins: [
    typescript()
  ]
}
