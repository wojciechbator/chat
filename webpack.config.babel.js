import webpack from 'webpack';
import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';

const production = process.env.NODE_ENV === 'production';

const BUILD_DIR = path.resolve(__dirname, 'build');
const APP_DIR = path.resolve(__dirname, 'client');

const config = {
    entry: path.join(APP_DIR + '/index.jsx'),
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js',
        publicPath: "/"
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: './index.html'}
        ]),
        new CleanWebpackPlugin([
            BUILD_DIR,
        ])
    ],
    target: "web",
    module: {
      loaders: [
          {
              test: /\jsx?/,
              include: APP_DIR,
              loader: 'babel-loader',
              query: {
                  presets: ['react', 'es2015']
              }
          },
          {
              test: /\less$/,
              loader: "style-loader!css-loader!less-loader"
          }
      ]
    },
    devtool: production? false : "source-map",
    // debug: !production,
    devServer: {
        proxy: {
          '/chat*': {
            target: 'http://localhost:8080',
            secure: false
          }
        }
    }
};

export default config;
