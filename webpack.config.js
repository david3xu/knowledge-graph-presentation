const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.ts',
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        }
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    plugins: [
      // We won't use HtmlWebpackPlugin in development mode
      // since we're serving the static HTML directly
      ...(isProduction ? [
        new HtmlWebpackPlugin({
          template: './public/index.html',
          minify: {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true
          }
        })
      ] : []),
      // Copy content files to dist folder
      new CopyWebpackPlugin({
        patterns: [
          { 
            from: 'public/content',
            to: 'content' 
          },
          // Copy index.html to root in development mode
          ...(isProduction ? [] : [
            { 
              from: 'public/index.html',
              to: 'index.html' 
            }
          ])
        ],
      }),
    ],
    devServer: {
      static: [
        {
          directory: path.join(__dirname, 'public'),
        },
        {
          directory: path.join(__dirname, 'public/content'),
          publicPath: '/content'
        }
      ],
      compress: true,
      port: 8080,
      hot: true,
      open: true,
      historyApiFallback: true,
    },
    optimization: {
      minimize: isProduction,
    }
  };
};