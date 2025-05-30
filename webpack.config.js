const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: {
      'vimm-player': './src/index.js',
      'vimm-player.min': './src/index.js'
    },

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      library: {
        name: 'VimmPlayer',
        type: 'umd',
        export: 'default'
      },
      globalObject: 'this',
      clean: true
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    browsers: ['> 1%', 'last 2 versions', 'not ie <= 11']
                  },
                  modules: false
                }]
              ]
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ]
        }
      ]
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: 'vimm-player.css'
      }),
      
      // Generate example HTML for development
      new HtmlWebpackPlugin({
        template: './examples/basic.html',
        filename: 'example.html',
        inject: false
      })
    ],

    optimization: {
      minimize: isProduction,
      splitChunks: false // Keep everything in one bundle for library
    },

    resolve: {
      extensions: ['.js', '.css']
    },

    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
        publicPath: '/'
      },
      compress: true,
      port: 3005,
      hot: true,
      open: '/example.html',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
      }
    },

    externals: {
      // Don't bundle hls.js in production, let consumers decide
      ...(isProduction && {
        'hls.js': {
          commonjs: 'hls.js',
          commonjs2: 'hls.js',
          amd: 'hls.js',
          root: 'Hls'
        }
      })
    }
  };
};