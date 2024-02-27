import './styles/main.scss';
import 'flowbite';
import { Identity, Monetization, Payment } from '@schibsted/account-sdk-browser';
import { initPageInteraction } from './interaction';

const {
    clientId,
    sessionDomain,
    spidEnv,
    siteSpecificLogout,
    paymentPublisher,
} = window.config;

const redirectUri = `${window.location.origin}/safepage`;

window.identity = new Identity({
    clientId,
    sessionDomain,
    env: spidEnv,
    siteSpecificLogout,
    log: console.log,
    redirectUri,
});

window.identity.on('login', () => console.log('User is logged in to SSO.'));

window.identity.on('logout', () => {
    // Logged out from SSO. Need to cancel merchant session as well
    console.log('User is logged out from SSO.');
    window.location.reload();
});

window.monetization = new Monetization({
    clientId,
    sessionDomain,
    env: spidEnv,
    log: console.log,
    redirectUri,
});

window.payment = new Payment({
    clientId,
    env: spidEnv,
    log: console.log,
    redirectUri,
    publisher: paymentPublisher,
});

initPageInteraction();
