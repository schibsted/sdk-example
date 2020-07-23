'use strict';

import 'regenerator-runtime/runtime';

import { Identity, Payment, Monetization } from '@schibsted/account-sdk-browser';
window.Identity = Identity; // To be able to play around with it in the console...
window.Payment = Payment;
window.Monetization = Monetization;

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
    const {
        clientId,
        exampleProductId,
        paymentPublisher,
        sessionDomain,
        spidEnv,
        siteSpecificLogout,
    } = window.config;
    const redirectUri = `${window.location.origin}/safepage`;
    const identity = new Identity({ clientId, sessionDomain, env: spidEnv, siteSpecificLogout, log: console.log, redirectUri });
    const payment = new Payment({ clientId, env: spidEnv, log: console.log, redirectUri, publisher: paymentPublisher });
    const monetization = new Monetization({ clientId, sessionDomain, env: spidEnv, log: console.log, redirectUri });
    Object.assign(window, { identity, payment, monetization });

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
    async function isLoggedInToSSO() {
        try {
            const loggedIn = await identity.isLoggedIn();
            $$('is-logged-in-to-sso').textContent = (loggedIn ? 'Yes' : 'No');
            if (loggedIn) {
                const userInfo = document.getElementById('userInfo');
                const img = document.querySelector('#userInfo > img');
                if (img) {
                    const a = document.createElement('a');
                    a.href = identity.accountUrl();
                    a.title = "Account page";
                    userInfo.removeChild(img);
                    a.appendChild(img);
                    userInfo.appendChild(a);
                }
            }
        } catch (err) {
            $$('is-logged-in-to-sso').textContent = `Error: ${err}`;
        }
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
     * This function will be re-implemented in account-browser-sdk
     * @param {Object} paymentInstance - payment object instance
     * @returns {function}
     */
    function buyPromoCodeProduct(paymentInstance = payment) {
        return function buyPromoCodeProductOnClick(e) {
            const productId = e.target.parentNode.getElementsByClassName('product-id')[0].value;
            window.location = paymentInstance.purchasePromoCodeProductFlowUrl(productId, generateState());
        }
    }

    /**
     * Redirect to checkout flow
     * @return {void}
     */
    function buyProduct() {
        window.location = payment.purchaseProductFlowUrl(exampleProductId);
    }

    async function simplifiedLoginWidget(e) {
        e.preventDefault();

        const state = generateState();

        const loginParams = {
            state,
            scope: 'openid profile',
        };

        try {
            await identity.showSimplifiedLoginWidget(loginParams);
        } catch (e) {
            console.log(e);
        }
    }

    $$('update-is-logged-in-to-sso').onclick = isLoggedInToSSO;
    $$('update-is-connected').onclick = isConnected;
    $$('get-user-info-sso').onclick = getUserSSO;
    $$('get-user-info-token').onclick = getUserToken;
    $$('query-merchant-log-in').onclick = isLoggedInToMerchant;
    $$('introspect-token').onclick = introspectToken;
    $$('buy-product-old-flow').onclick = buyProduct;
    $$('buy-promo-code-product').onclick = buyPromoCodeProduct();
    $$('simplified-login-widget-trigger').onclick = simplifiedLoginWidget;
    if (window.config.alternativeClient) {
        $$('buy-promo-code-product-alternative-client').onclick = buyPromoCodeProduct(
            new Payment(
                window.config.alternativeClient,
            )
        );
        $$('buy-promo-code-product-alternative-client-pay-now-login-after').onclick = (e) => {
            const payment = new Payment(
                window.config.alternativeClient,
            );

            Payment.prototype.payNowLoginAfterPromoCodeProdutUrl = function (code, state = '', redirectUri = this.redirectUri) {
                return this._bff.makeUrl('payment/purchase/code/anonymous/vipps', {
                    code,
                    publisher: this.publisher,
                    state,
                    redirect_uri: redirectUri
                });
            };

            const productId = e.target.parentNode.getElementsByClassName('product-id')[0].value;
            window.location = payment.payNowLoginAfterPromoCodeProdutUrl(productId);
        };
    }

    isLoggedInToSSO();
    isLoggedInToMerchant();
    isConnected();

    function generateState(preferPopup = false) {
        const char = () => Math.floor((Math.random() * (122 - 97)) + 97);
        const stateObj = {
            id: Array.from({length: 20}, () => String.fromCharCode(char())).join(''),
            popup: preferPopup,
        };
        return btoa(JSON.stringify(stateObj));
    }

    function login(e) {
        e.preventDefault();

        const preferPopup = document.getElementById('use-popup').checked;
        const state = generateState(preferPopup);
        const getAcrValues = () => {
            const checkedAcr = document.querySelectorAll('[name=login-method]:checked');
            const acrs = [];
            for (let acr of checkedAcr) {
                acrs.push(acr.value);
            }
            return acrs.join(' ');
        };

        Identity.prototype.loginUrl = function({
            state,
            acrValues,
            scope = 'openid',
            redirectUri = this.redirectUri,
            newFlow = true,
            loginHint = '',
            tag = '',
            teaser = '',
            maxAge = '',
            locale = '',
            oneStepLogin = false
        }) {
            if (typeof arguments[0] !== 'object') {
                // backward compatibility
                state = arguments[0];
                acrValues = arguments[1];
                scope = arguments[2] || scope;
                redirectUri = arguments[3] || redirectUri;
                newFlow = typeof arguments[4] === 'boolean' ? arguments[4] : newFlow;
                loginHint = arguments[5] || loginHint;
                tag = arguments[6] || tag;
                teaser = arguments[7] || teaser;
                maxAge = isNaN(arguments[8]) ? maxAge : arguments[8];
            }

            if (newFlow) {
                return this._oauthService.makeUrl('oauth/authorize', {
                    response_type: 'code',
                    'new-flow': true,
                    redirect_uri: redirectUri,
                    scope,
                    state,
                    acr_values: acrValues,
                    login_hint: loginHint,
                    tag,
                    teaser,
                    max_age: maxAge,
                    locale,
                    one_step_login: oneStepLogin || '',
                    prompt: this.siteSpecificLogout && !acrValues ? 'select_account' : ''
                });
            } else {
                // acrValues do not work with the old flows
                return this._spid.makeUrl('flow/login', {
                    response_type: 'code',
                    redirect_uri: redirectUri,
                    scope,
                    state,
                    email: loginHint,
                    tag,
                    teaser,
                    locale
                });
            }
        };

        const popup = identity.login({
            state,
            scope: 'openid profile',
            acrValues: getAcrValues(),
            preferPopup,
            newFlow: document.getElementById('use-new-flow').checked,
            loginHint: document.getElementById('preferred-email').value,
            oneStepLogin: document.getElementById('one-step-login').checked,
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
        const redirectUri = window.location.origin;
        identity.logout(redirectUri);
    };

    $$('logout-merchant').onclick = function (e) {
        e.preventDefault();
        logoutMerchant();
    };

    const monetizationCheck = (productIdGetter, resultContainer, fn) => async (e) => {
        e.preventDefault();
        const productId = productIdGetter();
        const result = await monetization[fn](productId);
        const resultDiv = document.createElement('pre');
        resultDiv.innerText = JSON.stringify(result, null, 2);
        resultContainer.appendChild(resultDiv);
    };

    const monetizationCheckHasAccess = async (e) => {
        try {
            e.preventDefault();
            const userData = await identity.getUser();
            const productId = $$('has-access-id').value;
            const result = await monetization.hasAccess(productId.split(','), userData.uuid);
            const resultDiv = document.createElement('pre');
            resultDiv.innerText = JSON.stringify(result, null, 2);
            $$('has-access-container').appendChild(resultDiv);
        } catch (err) {
            const errorDiv = document.createElement('pre');
            errorDiv.innerHTML = `Error: ${err}`;
            $$('has-access-container').appendChild(errorDiv);
        }
    };

    $$('has-product').onclick = monetizationCheck(
        () => $$('has-product-id').value,
        $$('has-product-container'),
        'hasProduct');

    $$('has-subscription').onclick = monetizationCheck(
        () => $$('has-subscription-id').value,
        $$('has-subscription-container'),
        'hasSubscription');

    $$('has-access').onclick = monetizationCheckHasAccess;
});
