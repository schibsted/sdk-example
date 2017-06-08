/* global SPiD, $ */
/* eslint-env browser */

'use strict';

// This stuff will ofc end up in the JS SDK
$(document).ready(function() {
    // TODO remove this Workaround
    SPiD.Talk = {
        response: (id, data) => window[id](data)
    };

    const spid = new SPiD.default({
        serverUrl: '{{config.spidBaseUrl}}',
        popup: true,
        useSessionCluster: false,
        client_id: '{{config.clientId}}',
        redirect_uri: window.location.toString()
    });

    const safePage = `${window.location.protocol}://${window.location.hostname}/safepage`;

    spid.event.addListener('SPiD.logout', function () {
        alert('Logged out from SPiD. Need to cancel out session');
    });

    // Check session
    spid.hasSession();

    $('#login-btn').click(function (e) {
        e.preventDefault();
        spid.login(window.location.href + 'safepage');
    });

    $('#login-btn-email').click(function (e) {
        e.preventDefault();
        spid.login(safePage, 'otp-email');
    });

    $('#login-btn-sms').click(function (e) {
        e.preventDefault();
        spid.login(safePage, 'otp-sms');
    });

    $('#login-async-btn').click(function (e) {
        e.preventDefault();
        setTimeout(function () {
            spid.login(safePage);
        }, 100);
    });

    $('#logout-btn').click(function () {
        // TEMPORARY HACK UNTIL LOGOUT WORKS IN THE browser-sdk API
        $.ajax('/session', { method: 'DELETE' })
            .then(() => alert('Logged out!'))
            .catch((err) => alert(`Could not log out! ${err}`));
    });
});
