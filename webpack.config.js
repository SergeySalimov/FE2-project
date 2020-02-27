const webpack = require('webpack');
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const DIR_FROM = 'src';
const DIR_TO = 'dist';

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

module.exports = {
  context: path.resolve(__dirname, DIR_FROM),
  mode: 'development',
  entry: {
    main: './index.js',
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.js'],
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@css': path.resolve(__dirname, 'src/css'),
      '@js': path.resolve(__dirname, 'src/css'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  output: {
    // [name], [contenthash]
    filename: '[hash].bundle.js',
    path: path.resolve(__dirname, DIR_TO),
    publicPath: '/',
  },
  devServer: {
    contentBase: path.resolve(__dirname, DIR_FROM),
    port: 4200,
    open: 'chrome',
    historyApiFallback: {
      index: 'index.html',
    },
    publicPath: '/',
    // hot: isDev,
  },
  plugins: [
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery',
    }),
    new HTMLWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // filename: 'style.[hash].css',
      filename: '[name].css',
      // chunkFilename: '[id].css',
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, `${DIR_FROM}/favicon.ico`),
        to: path.resolve(__dirname, DIR_TO),
      },
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          },
        },
      },
      {
        test: /\.handlebars$/,
        loader: 'handlebars-loader',
      },
      {
        test: /\.css$/i,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: isDev,
            reloadAll: true,
          },
        }, 'css-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpe?g|svg|gif|ico)$/,
        use: ['file-loader?name=images/[name].[ext]'],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader?name=font/[name].[ext]'],
      },
    ],
  },
};
