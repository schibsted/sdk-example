'use strict';

import 'regenerator-runtime/runtime';

import { Identity, Payment } from '@schibsted/account-sdk-browser';
window.Identity = Identity; // To be able to play around with it in the console...
window.Payment = Payment;

/**
 * Logout the user from merchant
 * @return {Promise}
 */
function logoutMerchant() {
    return fetch('/logout', { credentials: 'include' })
        .then(() => window.location.reload())
        .catch(err => alert(`Failed to logout ${String(err)}`));
}

function $$(klass) {
    return document.getElementsByClassName(klass)[0]
}

document.addEventListener("DOMContentLoaded", function() {
    const { spidEnv, clientId, exampleProductId } = window.config;
    const redirectUri = `${window.location.origin}/safepage`;
    const identity = new Identity({ clientId, env: spidEnv, log: console.log, redirectUri });
    const payment = new Payment({ clientId, env: spidEnv, log: console.log, redirectUri });

    identity.on('login', () => console.log('User is logged in to SSO.'));

    identity.on('logout', function () {
        //Logged out from SSO. Need to cancel merchant session as well
        console.log('User is logged out from SSO.');
        window.location.reload();
    });

    /**
     * Checks if the user is logged in to SSO and updates the page accordingly
     * @return {void}
     */
    function isLoggedInToSSO() {
        identity.isLoggedIn()
            .then(loggedIn => $$('is-logged-in-to-sso').textContent = (loggedIn ? 'Yes' : 'No'))
            .catch(err => $$('is-logged-in-to-sso').textContent = `Error: ${err}`);
    }

    /**
     * Checks if the user is connected to this merchant
     * @return {void}
     */
    function isConnected() {
        identity.isConnected()
            .then(con => {
                const e = $$('user-is-connected-to-merchant');
                e.textContent = (con ? 'Yes' : 'No');
                e.removeAttribute('title');
            })
            .catch(err => $$('user-is-connected-to-merchant').textContent = `Error: ${err}`);
    }


    /**
     * Gets the user information (given that they are logged in and connected)
     * @return {void}
     */
    function getUserSSO() {
        identity.getUser()
            .then(user => $$('user-info-sso').textContent = JSON.stringify(user, undefined, 2))
            .catch(err => $$('user-info-sso').textContent = `Error: ${err}`);
    }

    /**
     * Gets the user info using the access token in the backend
     * @return {void}
     */
    async function getUserToken() {
        try {
            const response = await fetch('/userinfo', { credentials: 'include' });
            const json = await response.json();
            $$('user-info-token').textContent = JSON.stringify(json, undefined, 2);
        } catch (err) {
            $$('user-info-token').textContent = `Error: ${err.responseText}`;
        }
    }

    /**
     * Introspects the token
     * @return {void}
     */
    async function introspectToken() {
        try {
            const response = await fetch('/introspect', { credentials: 'include' });
            const json = await response.json();
            $$('token-introspection-result').textContent = JSON.stringify(json, undefined, 2)
        } catch (err) {
            $$('token-introspection-result').textContent = `Error: ${err}`
        }
    }

    /**
     * Checks if the user is logged in to merchant and updates the page
     * @return {void}
     */
    async function isLoggedInToMerchant() {
        try {
            const response = await fetch('/isloggedin', { credentials: 'include' });
            const json = await response.json();
            const e = $$('is-logged-in-to-merchant');
            e.textContent = json.isLoggedin;
            e.removeAttribute('title');
        } catch (error) {
            const e = $$('is-logged-in-to-merchant');
            e.textContent = error;
            e.setAttribute('title', error.responseText);
        }
    }

    /**
     * Redirect to checkout flow
     * @return {void}
     */
    function buyProduct() {
        window.location = payment.purchaseProductFlowUrl(exampleProductId);
    }

    $$('update-is-logged-in-to-sso').onclick = isLoggedInToSSO;
    $$('update-is-connected').onclick = isConnected;
    $$('get-user-info-sso').onclick = getUserSSO;
    $$('get-user-info-token').onclick = getUserToken;
    $$('query-merchant-log-in').onclick = isLoggedInToMerchant;
    $$('introspect-token').onclick = introspectToken;
    $$('buy-product-old-flow').onclick = buyProduct;

    isLoggedInToSSO();
    isLoggedInToMerchant();
    isConnected();

    function login(e) {
        e.preventDefault();

        const preferPopup = document.getElementById('use-popup').checked;
        const char = () => Math.floor((Math.random() * (122 - 97)) + 97);
        const stateObj = {
            id: Array.from({length: 20}, () => String.fromCharCode(char())).join(''),
            popup: preferPopup,
        };
        const state = btoa(JSON.stringify(stateObj));
        const popup = identity.login({
            state,
            scope: 'openid profile',
            acrValues: document.querySelector('input[type=radio][name=login-method]:checked').value,
            preferPopup,
            newFlow: document.getElementById('use-new-flow').checked,
            loginHint: document.getElementById('preferred-email').value,
        });
        if (popup) {
            window.addEventListener("message", event => {
                if (!(event.origin === window.location.origin || Object.is(event.source, popup))) {
                    return;
                }
                const data = JSON.parse(event.data);
                console.log('Message from popup:', data);
                popup.close();
                isLoggedInToSSO();
                isLoggedInToMerchant();
                isConnected();
            });
        }
    }

    Array.prototype.forEach.call(document.getElementsByClassName('login'), e => e.onclick = login);

    $$('logout-sso').onclick = function (e) {
        e.preventDefault();
        identity.logout();
    };

    $$('logout-merchant').onclick = function (e) {
        e.preventDefault();
        logoutMerchant();
    };
});
