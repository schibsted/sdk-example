/* global SPiD, $ */
/* eslint-env browser */

'use strict';

// This stuff will ofc end up in the JS SDK
$(document).ready(function() {
    // TODO remove this Workaround
    SPiD.Talk = {
        response: (id, data) => window[id](data)
    };

    const spidOptions = {
        serverUrl: window.config.spidBaseUrl,
        paymentServerUrl: window.config.paymentServerUrl,
        popup: true,
        useSessionCluster: false,
        client_id: window.config.clientId,
        redirect_uri: window.location.origin
    };

    const spid = new SPiD.default(spidOptions);

    const safePage = `${window.location.origin}/safepage`;

    spid.event.addListener('login', function () {
        alert('User already logged in.');
        // window.location.reload();
    });

    spid.event.addListener('logout', function () {
        alert('Logged out from SPiD. Need to cancel out session');
        window.location.reload();
    });

    // Check session
    spid.hasSession().then(
        (response) => console.log('HasSession success:', response),
        (err) => console.error('HasSession failure:', err)
    );

    $('#login-user-pass').click(function (e) {
        e.preventDefault();
        spidOptions.popup = $('#usePopup').is(':checked');
        spid.login(safePage);
    });

    $('#login-email').click(function (e) {
        e.preventDefault();
        spidOptions.popup = $('#usePopup').is(':checked');
        spid.login('otp-email', safePage);
    });

    $('#login-sms').click(function (e) {
        e.preventDefault();
        spidOptions.popup = $('#usePopup').is(':checked');
        spid.login('otp-sms', safePage);
    });

    $('#logout-btn').click(function () {
        // TEMPORARY HACK UNTIL LOGOUT WORKS IN THE browser-sdk API
        $.ajax('/session', { method: 'DELETE' })
            .then(() => alert('Logged out!'))
            .catch((err) => alert(`Could not log out! ${err}`));
    });
});
