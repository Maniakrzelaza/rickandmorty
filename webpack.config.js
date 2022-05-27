const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const root = path.join.bind(path, path.resolve(__dirname, "./"));

module.exports = {
    entry: {
        app: './src/index.tsx',
        hot: 'webpack/hot/dev-server.js',
        client: 'webpack-dev-server/client/index.js?hot=true&live-reload=true',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(jpe?g|gif|png|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                    }
                ]
            },
            {
                test: /\.mp3$/,
                loader: 'file-loader',
            },
            {
                test: /\.(scss|css)$/,
                use: [{
                    loader: 'style-loader', // inject CSS to page
                }, {
                    loader: 'css-loader', // translates CSS into CommonJS modules
                }, {
                    loader: 'postcss-loader', // Run post css actions
                }, {
                    loader: 'sass-loader' // compiles Sass to CSS
                }]
            }
        ],
    },
    resolve: {
        alias: {
            "assets": root("./src/assets/").replace(/[\/]$/, ""),
        },
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx", ".svg", ".png", ".jpg"],
        symlinks: false,
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash:8].js',
        sourceMapFilename: '[name].[hash:8].map',
        chunkFilename: '[id].[hash:8].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "index.html"),
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CopyPlugin({
            patterns: [
                { from: './src/assets', to: 'assets'},
            ],
        }),
        new NodePolyfillPlugin(),
    ],
}