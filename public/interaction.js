import hljs from 'highlight.js';
import 'highlight.js/scss/github-dark.scss';
import { hideResults } from './utils';

const initPageInteraction = () => {
    /// navbar toggle
    window.toggleNavbar = (collapseID) => {
        document.getElementById(collapseID).classList.toggle('hidden');
        document.getElementById(collapseID).classList.toggle('bg-white');
        document.getElementById(collapseID).classList.toggle('m-2');
        document.getElementById(collapseID).classList.toggle('py-3');
        document.getElementById(collapseID).classList.toggle('px-6');
    };

    document.addEventListener('DOMContentLoaded', () => {
        /// code snippets
        hljs.highlightAll();

        /// navigation
        const activeNavItem = (clickedElement) => {
            [...document.querySelectorAll('.nav-item')].forEach((element) => {
                element.classList.remove('text-pink-600');
                element.classList.add('text-gray-400');
            });

            clickedElement.classList.add('text-pink-600');
            clickedElement.classList.remove('text-gray-400');

            document.querySelector(`#${clickedElement.dataset.target}`).classList.remove('hidden');

            // hide all items from nav
            [...document.querySelectorAll('.sdk-method')].forEach((element) => {
                element.parentNode.querySelector('ul').classList.add('hidden');
            });

            // show item in nav
            clickedElement.parentNode.parentNode.classList.remove('hidden');

            localStorage.setItem('navigation', clickedElement.dataset.target);

            hideResults();
        };

        // nav main item click
        [...document.querySelectorAll('.sdk-method')].forEach((element) => {
            element.addEventListener('click', (event) => {
                event.target.parentNode.querySelector('ul').classList.toggle('hidden');
            });
        });

        // nav sub item click
        [...document.querySelectorAll('[data-target]')].forEach((element) => {
            element.addEventListener('click', (event) => {
                [...document.querySelectorAll('.nav-target')].forEach((navElement) => {
                    navElement.classList.add('hidden');
                });

                activeNavItem(event.target);
            });
        });

        // active last visited nav item
        activeNavItem(
            document.querySelector(`[data-target=${localStorage.getItem('navigation') || 'login'}]`),
        );

        // auto-hide results tab
        document.querySelector('#main-wrapper').classList.remove('md:mr-96');

        // copy to clipboard from results tab
        document.querySelector('#copy-result').addEventListener('click', () => {
            const resultHiddenInput = document.querySelector('#result-data-input');

            resultHiddenInput.select();

            navigator.clipboard.writeText(resultHiddenInput.value);
        });

    });
};

// eslint-disable-next-line import/prefer-default-export
export { initPageInteraction };
