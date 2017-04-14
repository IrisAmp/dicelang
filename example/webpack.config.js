var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        './app/index.tsx'
    ],
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, '/dist'),
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
        }, {
            enforce: 'pre',
            test: /\.js$/,
            loader: 'source-map-loader',
        }]
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    devServer: {
        port: 1337,
        hot: true,
        compress: true,
    }
};
