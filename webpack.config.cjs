const path = require("path");

const commonRules = {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            }
        ],
    },
    devtool: 'source-map',
    optimization: {
        minimize: true,
    },
    plugins: [],
}

const cjsConfig = {
    entry: {
        index: './browser/index.js',
        safepage: './browser/safepage.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].min.js',
    },
    ...commonRules,
};

module.exports = [cjsConfig]
