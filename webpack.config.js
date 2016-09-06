const pkg = require('./package.json');
const path = require('path');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const Clean = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

const TARGET = process.env.npm_lifecycle_event;
const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, 'app');
const BUILD_PATH = path.resolve(ROOT_PATH, 'build');

process.env.BABEL_ENV = TARGET;

const common = {
    entry: APP_PATH,
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: BUILD_PATH,
        filename: 'bundle.js'
    },
    module: {
        preLoaders: [
            {
                test: /\.jsx?$/,
                loaders: ['eslint'],
                include: APP_PATH,
                exclude: `${APP_PATH}/plugins/GA/vendor`
            }
        ],
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['babel?cacheDirectory'],
                include: APP_PATH
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: './app/plugins/GA/vendors/abcjs.js',
                to: './abcjs.js'
            }
        ]),
        new HtmlwebpackPlugin({
            inject: true,
            title: 'GENOM',
            template: 'template.html'
        }),
        new OpenBrowserPlugin()
    ],
    // TODO: find out a better way
    externals: {
        'ABCJS': 'ABCJS'
    }
};

if ( TARGET === 'start' || !TARGET ) {
    module.exports = merge(common, {
        devtool: 'source-map',//'eval-source-map',
        devServer: {
            historyApiFallback: true,
            hot: false, // true to HMR
            inline: true,
            progress: true,
            host: '0.0.0.0'
        },
        module : {
            loaders: [
                {
                    test: /\.css$/,
                    loaders: ['style', 'css'],
                    include: APP_PATH
                }
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    });
}

if ( TARGET === 'build' || TARGET === 'stats' ) {
    module.exports = merge(common, {
        entry: {
            app: APP_PATH,
            vendor: Object.keys(pkg.dependencies)
        },
        output: {
            path: BUILD_PATH,
            filename: '[name].[chunkhash].js'
        },
        devtool: 'source-map',
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style', 'css'),
                    include: APP_PATH
                }
            ]
        },
        plugins: [            
            new Clean(['build']),
            new ExtractTextPlugin('style.[chunkhash].css'),
            new webpack.optimize.CommonsChunkPlugin(
                'vendor',
                '[name].[chunkhash].js'
            ),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        ]
    });
}