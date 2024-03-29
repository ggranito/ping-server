var webpack = require('webpack');
var NodemonPlugin = require('nodemon-webpack-plugin');
var nodeExternals = require('webpack-node-externals');
var path = require('path');

var serverConfig = (env, options) => {
    var isProd = options.mode == "production";
    var devplugins = isProd ? [] : [new NodemonPlugin()];
    var externals = isProd ? [] : [nodeExternals()];
    var BUILD_DIR = isProd ? 'release' : 'devbuild';
    var APP_DIR = 'src';

    return {
        name: "server",
        entry: path.resolve(__dirname, APP_DIR, 'Main.ts'),
        
        output: {
            path: path.resolve(__dirname, BUILD_DIR),
            filename: 'server-bundle.js'
        },

        resolve: {
            extensions: [
                ".ts", 
                ".js", 
                ".json"
            ]
        },

        module: {
            rules: [
                // All files with a '.ts' extension will be handled by 'ts-loader'.
                { test: /\.ts$/, loader: "ts-loader" },
            ]
        },

        watch: !isProd,

        watchOptions: {
            ignored: /node_modules/
        },

        externals: externals,

        plugins: [
            new webpack.DefinePlugin({
                'process.env.PORT' : isProd ? 80 : 9010,
                'process.env.USE_HTTPS' : isProd
            })
        ].concat(devplugins),

        target: 'node',
        node: {
            __dirname: true,
            __filename: true
        }
    };
};

module.exports = serverConfig;