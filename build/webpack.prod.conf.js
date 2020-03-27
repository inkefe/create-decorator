const path = require('path');
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.conf')

const isProd = process.env.NODE_ENV === 'production';
const filename = isProd ? 'create-decorator.production.min.js' : 'create-decorator.development.js';

module.exports = merge(baseConfig, {
  entry: './src/index.js',
  mode: isProd ? 'production' : 'development',
  output: {
    filename,
    path: path.resolve('./lib'),
    library: 'create-decorator',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
});
