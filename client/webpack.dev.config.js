const path = require('path');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        'main': './scripts/main.tsx',
        'styles': './styles/styles.styl',
        'config': './config/config.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './public/bundle'),
        library: '[name]'
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: './tsconfig.json'
            })
        ]
    },
    externals: {
        mocha: 'mocha',
        chai: 'chai'
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: ['ts-loader']
        }, {
            test: /\.styl$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                { loader: 'postcss-loader' },
                'stylus-loader'
            ]
        }, {
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'clean-css-loader',
                { loader: 'postcss-loader' }
            ]
        }, {
            test: /\.(woff|woff2|eot|ttf|svg)$/,
            use: [
                'file-loader'
            ]
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ]
};
