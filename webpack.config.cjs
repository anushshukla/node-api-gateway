import path from 'path';

const config = {
  // entry: path.resolve(__dirname, 'src'),
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.mjs'],
  },
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
