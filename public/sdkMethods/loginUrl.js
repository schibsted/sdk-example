import { generateState, showResults } from '../utils';

document.addEventListener('DOMContentLoaded', async () => {
    const elements = {
        usePopup: document.querySelector('#login-url-use-popup'),
        oneStepLogin: document.querySelector('#login-url-one-step-login'),
        startNewFlow: document.querySelector('#login-url-start-new-flow'),
        loginButton: document.querySelector('#login-url-login-button'),
        acrValues: document.querySelectorAll('[name=login-url-login-method]:checked'),
        runLoginUrlButton: document.querySelector('#run-loginUrl'),
        locale: document.querySelector('#login-url-locale'),
    };

    elements.runLoginUrlButton.addEventListener('click', (event) => {
        event.preventDefault();

        const preferPopup = elements.usePopup.checked;
        const state = generateState(preferPopup);

        const getAcrValues = () => [...elements.acrValues].map(({value})=>value).join(' ');

        showResults(
            window.identity.loginUrl({
                state,
                scope: 'openid profile',
                acrValues: getAcrValues(),
                preferPopup,
                newFlow: elements.startNewFlow.checked,
                oneStepLogin: elements.oneStepLogin.checked,
                locale: elements.locale.value,
            }),
        );
    });

});
