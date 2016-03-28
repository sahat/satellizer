import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/main.js',
  format: 'cjs',
  plugins: [babel()],
  dest: 'bundle.js' // equivalent to --output
};
