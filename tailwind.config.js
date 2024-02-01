/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./server/**/*.hbs', './node_modules/flowbite/**/*.js'],
    theme: {
        extend: {},
    },
    plugins: [
        // eslint-disable-next-line global-require
        require('flowbite/plugin'),
    ],
};
