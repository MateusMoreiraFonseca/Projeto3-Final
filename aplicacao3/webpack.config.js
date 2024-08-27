const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  mode: 'production', // modo de produção para otimizar o código
  entry: './src/index.js', // ponto de entrada do seu aplicativo
  output: {
    path: path.resolve(__dirname, 'build'), // diretório de saída para os arquivos bundle
    filename: '[name].[contenthash].js', // nome do arquivo bundle com hash para cache busting
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/, // aplica a regra a arquivos .js
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'], // transpila JS moderno e JSX
          },
        },
      },
      {
        test: /\.css$/, // aplica a regra a arquivos .css
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader', // processa CSS
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i, // regra para imagens
        type: 'asset/resource', // move as imagens para o diretório de saída
      },
    ],
  },
  optimization: {
    minimize: true, // habilita a minimização
    minimizer: [
      new TerserPlugin(), // minimiza o JavaScript
      new CssMinimizerPlugin(), // minimiza o CSS
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // limpa a pasta de build antes de cada build
    new HtmlWebpackPlugin({
      template: './public/index.html', // gera o arquivo HTML e injeta o bundle JS
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css', // nome do arquivo CSS gerado com hash
    }),
  ],
};
