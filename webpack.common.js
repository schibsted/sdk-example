const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            }
        ],
    },
    plugins: [],
    entry: {
        index: './public/index.js',
        safepage: './public/safepage.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].min.js',
        clean: true,
    },
    optimization: {
        minimizer: [new TerserPlugin({ extractComments: false })],
    },
};
