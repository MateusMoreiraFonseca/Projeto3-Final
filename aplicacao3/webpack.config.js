const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = {
  plugins: [
    new CompressionWebpackPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/, 
      threshold: 10240, 
      minRatio: 0.2, 
    }),
  ],
};
