import { generateState, showResults } from '../utils';

document.addEventListener('DOMContentLoaded', async () => {
    const elements = {
        usePopup: document.querySelector('#use-popup'),
        oneStepLogin: document.querySelector('#one-step-login'),
        startNewFlow: document.querySelector('#start-new-flow'),
        loginButton: document.querySelector('#login-button'),
        acrValues: document.querySelectorAll('[name=login-method]:checked'),
        preferredEmail: document.querySelector('#preferred-email'),
        locale: document.querySelector('#locale'),
    };

    elements.loginButton.addEventListener('click', () => {
        const preferPopup = elements.usePopup.checked;
        const state = generateState(preferPopup);

        const getAcrValues = () => [...elements.acrValues].map(({value})=>value).join(' ');

        const popup = window.identity.login({
            state,
            scope: 'openid profile',
            acrValues: getAcrValues(),
            preferPopup,
            newFlow: elements.startNewFlow.checked,
            loginHint: elements.preferredEmail.value,
            oneStepLogin: elements.oneStepLogin.checked,
            locale: elements.locale.value,
        });

        if (popup) {
            window.addEventListener('message', async (event) => {
                if (!(event.origin === window.location.origin || Object.is(event.source, popup))) {
                    return;
                }

                try {
                    console.log('Message from popup:', event.data);

                    popup.close();

                    // eslint-disable-next-line no-use-before-define
                    await updateIsLoggedInToSso();
                } catch (error) {
                    showResults(error);
                }
            });
        }
    });

    async function updateIsLoggedInToSso() {
        try {
            const loggedIn = await window.identity.isLoggedIn();
            const userData = await window.identity.getUser();

            if (loggedIn) {
                document.querySelector('#sso-account-name').innerHTML = `You are logged in to SSO as <span class="underline">${userData.displayName}</span>!`;
            } else {
                document.querySelector('#sso-account-name').innerHTML = 'You are not logged in to SSO!';
            }
        } catch (err) {
            document.querySelector('#sso-account-name').innerHTML = 'You are not logged in to SSO!';
            showResults(err);
        }
    }
    document.querySelector('#update-login-sso').addEventListener('click', updateIsLoggedInToSso);

    async function updateIsLoggedInToSdk() {
        try {
            const response = await fetch('/isloggedin', { credentials: 'include' });
            const { isLoggedin, userInfo } = await response.json();

            if (isLoggedin) {
                document.querySelector('#sdk-account-name').innerHTML = `You are logged in to SDK Example as <span class="underline">${userInfo.preferred_username}</span>`;
            } else {
                document.querySelector('#sdk-account-name').innerHTML = 'You are not logged in to SDK Example';
            }
        } catch (error) {
            showResults(`Error: ${JSON.stringify(error, undefined, 2)}`);
        }
    }
    document.querySelector('#update-sdk-login').addEventListener('click', updateIsLoggedInToSdk);

    // fetch user on load
    await updateIsLoggedInToSso();

    // logout
    const logoutFromSdk = async () => {
        try {
            await fetch('/logout', { credentials: 'include' });
            window.location.reload();
        } catch (error) {
            showResults(`Error: ${JSON.stringify(error, undefined, 2)}`);
        }
    };
    document.querySelector('#logout-from-sdk').addEventListener('click', logoutFromSdk);

    const logoutFromSso = () => {
        const redirectUri = window.location.origin;
        window.identity.logout(redirectUri);
    };
    document.querySelector('#logout-from-sso').addEventListener('click', logoutFromSso);

    const fetchUserFromSdk = async () => {
        const response = await fetch('/userinfo', { credentials: 'include' });
        try {
            showResults(await response.json());
        } catch (error) {
            showResults(`Error: ${error}`);
        }
    };
    document.querySelector('#fetch-user-from-sdk').addEventListener('click', fetchUserFromSdk);

    const introspectToken = async () => {
        const response = await fetch('/introspect', { credentials: 'include' });
        try {
            showResults(await response.json());
        } catch (error) {
            showResults(`Error: ${error}`);
        }
    };
    document.querySelector('#introspect-token').addEventListener('click', introspectToken);

    // Simplified login
    const triggerSimplifiedLogin = () => {
        const preferPopup = elements.usePopup.checked;
        const state = generateState(preferPopup);

        const getAcrValues = () => [...elements.acrValues].map(({value})=>value).join(' ');

        try {
            window.identity.showSimplifiedLoginWidget({
                state,
                scope: 'openid profile',
                acrValues: getAcrValues(),
                preferPopup,
                newFlow: elements.startNewFlow.checked,
                loginHint: elements.preferredEmail.value,
                oneStepLogin: elements.oneStepLogin.checked,
                locale: elements.locale.value,
            });
        } catch (error) {
            showResults(`Error: ${error}`);
        }

    };
    document.querySelector('#simplified-login').addEventListener('click', triggerSimplifiedLogin);

});
