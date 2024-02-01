const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const glob = require('glob');

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
    entry: glob.sync('./public/**/**.js').reduce((obj, el) => {
        // eslint-disable-next-line no-param-reassign
        obj[path.parse(el).name] = `./${el}`;
        return obj;
    }, {}),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].min.js',
        clean: true,
    },
    optimization: {
        minimizer: [new TerserPlugin({ extractComments: false })],
    },
};
