var path = require('path');
var webpack = require('webpack');
var HtmlPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var stylesPath = [
    // path.resolve(__dirname, '.', 'src', 'pug'),
    // path.resolve(__dirname, '.', 'src', 'components'),
    // path.resolve(__dirname, '.', 'src', './app.component.sass')
];

var config = {
    cache: true,
    devtool: 'source-map',
    entry: {
        // polyfills: './src/config/polyfills',
        // vendor: './src/config/vendor',
        // main: './src/app.module',
        styles: './src/sass/main.sass'
    },
    output: {
        path: './dist',
        filename: '[name].bundle.js',
        sourceMapFilename: '[name].map',
        chunkFilename: '[id].chunk.js'
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'awesome-typescript-loader' },
            { test: /\.pug/, loader: 'pug-loader' },
            {
                test: /\.sass$/,
                include: stylesPath,
                loaders: ['raw-loader', 'sass-loader']
            },
            {
                test: /\.sass$/,
                exclude: stylesPath,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!resolve-url!sass-loader?sourceMap')
            },
            { test: /\.png$/, loader: "url-loader?mimetype=image/png" },
            { test: /\.woff$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
            { test: /\.woff2$/, loader: "url-loader?limit=10000&mimetype=application/font-woff2" },
            { test: /\.(eot|ttf|svg|gif)$/, loader: "file-loader" }
        ],
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['polyfills', 'vendor', 'main'].reverse(),
            minChunks: Infinity
        }),
        new HtmlPlugin({
            title: 'Weather application',
            chunks: ['polyfills', 'vendor', 'main'],
            filename: 'index.html',
            template: './src/pug/index.pug'
        }),
        new ExtractTextPlugin('bundle.css', {
            allChunks: true
        })
    ],
    resolve: {
        extensions: ['', '.ts', '.js', '.json'],
        modulesDirectories: ['node_modules']
    },
    devServer: {
        historyApiFallback: true,
        watchOptions: { aggregateTimeout: 300, poll: 1000 },
    }
};
module.exports = config;