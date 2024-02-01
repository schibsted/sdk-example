/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./server/**/*.hbs', "./node_modules/flowbite/**/*.js"],
    theme: {
        extend: {},
    },
    plugins: [
        require('flowbite/plugin')
    ],
}
