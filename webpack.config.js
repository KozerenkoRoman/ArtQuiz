const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './src/js/index.js',
    mode: 'development',

    output: {
        filename: 'main.js',
        path: path.join(__dirname, 'dist')
    },
    // devtool: 'inline-source-map',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    plugins: [
        new HtmlWebpackPlugin({
            favicon: './src/assets/favicon.ico',
            template: './src/index.html',
            inject: 'head',
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackInlineSVGPlugin({
            runPreEmit: true,
        }),
        new CopyPlugin({
            patterns: [
                {from: './src/assets/data', to: './assets/data'},
                {from: './src/assets/fonts', to: './assets/fonts'},
                {from: './src/assets/sounds', to: './assets/sounds'},
                {from: './src/assets/gallery/img', to: './assets/gallery/img'},
                {from: './src/assets/gallery/full', to: './assets/gallery/full'},
            ],
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
    },
    module: {
        rules: [
            {test: /\.html$/i, loader: 'html-loader',},
            {test: /\.json$/, loader: 'json'},
            {test: /\.css$/i, use: ['style-loader', 'css-loader']},
            // {test: /\.svg$/, use: {loader: 'svg-inline-loader?classPrefix'}},
            // {test: /\.svg$/, use: {loader: 'svg-url-loader'}},
            {test: /\.(png|jpg|jpeg|svg|gif|ico)$/i, type: 'asset/resource',},
            {test: /\.(woff|woff2|eot|ttf|otf)$/i, type: 'asset/resource',},
        ],
    },
}

