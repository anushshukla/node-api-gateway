import path from 'path';
import nodeExternals from 'webpack-node-externals';
import WebpackShellPlugin from 'webpack-shell-plugin';

const {
  NODE_ENV = 'production',
} = process.env;

const config = {
  entry: './src/index.ts',
  mode: NODE_ENV,
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.mjs'],
  },
  externals: [nodeExternals()],
  watch: NODE_ENV === 'development',
  plugins: [
    new WebpackShellPlugin({
      onBuildEnd: ['yarn run:dev'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          'ts-loader',
        ],
        exclude: /node_modules/,
      },
    ],
  },
};

export default config;
