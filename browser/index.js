'use strict';

/* global $ */
/* eslint-env browser */

require('regenerator-runtime/runtime');

/*
This code is in basic JavaScript. Some JQuery is used to make the code more readable
but the SDK has no dependency on JQuery.
The browser however, should support fetch and promises so you might want to polyfill them.
*/

const Identity = require('@schibsted/account-sdk-browser/identity');
const Payment = require('@schibsted/account-sdk-browser/payment');
window.Identity = Identity; // To be able to play around with it in the console...
window.Payment = Payment;

/**
 * Logout the user from merchant
 * @return {Promise}
 */
function logoutMerchant() {
    return $.get('/logout')
        .then(() => window.location.reload())
        .catch(err => alert(`Failed to logout ${String(err)}`));
}

// This stuff will ofc end up in the JS SDK
$(document).ready(function() {

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
            .then(loggedIn => $('.is-logged-in-to-sso').text(loggedIn ? 'Yes' : 'No'))
            .catch(err => $('.is-logged-in-to-sso').text(`Error: ${err}`));
    }

    /**
     * Checks if the user is connected to this merchant
     * @return {void}
     */
    function isConnected() {
        identity.isConnected()
            .then(con => $('.user-is-connected-to-merchant').text(con ? 'Yes' : 'No').removeAttr('title'))
            .catch(err => $('.user-is-connected-to-merchant').text(`Error: ${err}`));
    }


    /**
     * Gets the user information (given that they are logged in and connected)
     * @return {void}
     */
    function getUserSSO() {
        identity.getUser()
            .then(user => $('.user-info-sso').text(JSON.stringify(user, undefined, 2)))
            .catch(err => $('.user-info-sso').text(`Error: ${err}`));
    }

    /**
     * Gets the user info using the access token in the backend
     * @return {void}
     */
    function getUserToken() {
        $.get('/userinfo')
            .then(user => $('.user-info-token').text(JSON.stringify(user, undefined, 2)))
            .catch(error => {
                $('.user-info-token').text(`Error: ${error.responseText}`)
            });
    }

    /**
     * Introspects the token
     * @return {void}
     */
    function introspectToken() {
        $.get('/introspect')
            .then(introspectionResult => $('.token-introspection-result').text(JSON.stringify(introspectionResult, undefined, 2)))
            .catch(err => $('.token-introspection-result').text(`Error: ${err}`))
    }

    /**
     * Checks if the user is logged in to merchant and updates the page
     * @return {void}
     */
    function isLoggedInToMerchant() {
        $.get('/isloggedin')
            .then(o => $('.is-logged-in-to-merchant').text(o.isLoggedin).removeAttr('title'))
            .catch(error => $('.is-logged-in-to-merchant').text(error).attr('title', error.responseText))
    }

    /**
     * Redirect to checkout flow
     * @return {void}
     */
    function buyProduct() {
        window.location = payment.purchaseProductFlowUrl(exampleProductId);
    }

    $('.update-is-logged-in-to-sso').click(isLoggedInToSSO);
    $('.update-is-connected').click(isConnected);
    $('.get-user-info-sso').click(getUserSSO);
    $('.get-user-info-token').click(getUserToken);
    $('.query-merchant-log-in').click(isLoggedInToMerchant);
    $('.introspect-token').click(introspectToken);
    $('.buy-product-old-flow').click(buyProduct);

    isLoggedInToSSO();
    isLoggedInToMerchant();
    isConnected();

    $('.login').click(function (e) {
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
            acrValues: $("input:radio[name ='login-method']:checked").val(),
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
    });

    $('.logout-sso').click(function (e) {
        e.preventDefault();
        identity.logout();
    });

    $('.logout-merchant').click(function (e) {
        e.preventDefault();
        logoutMerchant();
    });
});
