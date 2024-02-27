module.exports = {
    extends: ['eslint:recommended', 'eslint-config-airbnb-base', 'prettier'],
    plugins: [
        'import',
    ],
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    parserOptions: {
        'ecmaVersion': 2020,
    },
    rules: {
        'no-undefined': 'off',
        'no-var': 'off',
        indent: [
            'warn',
            4,
        ],
        'no-console': 'off',
        'no-unused-vars': [
            'error',
            {
                argsIgnorePattern: 'next',
            },
        ],
        'valid-jsdoc': [
            'error',
            {
                requireParamDescription: false,
                requireReturnDescription: false,
            },
        ],
        'max-nested-callbacks': [
            'error',
            5,
        ],
        camelcase: 'off',
        'padded-blocks': 'off',
        'import/no-extraneous-dependencies': ['error', {'devDependencies': true}]
    },
};
