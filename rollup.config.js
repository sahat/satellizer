import typescript from 'rollup-plugin-typescript';

export default {
  entry: 'src/ng1.ts',
  dest: 'dist/satellizer.js',
  format: 'umd',
  moduleName: 'satellizer',
  plugins: [
    typescript()
  ]
}
