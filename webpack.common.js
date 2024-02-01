const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [],
    entry: {
        tailwind: './public/tailwind.js',
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
