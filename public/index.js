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
        popup: true,
        useSessionCluster: false,
        client_id: window.config.clientId,
        redirect_uri: window.location.toString()
    };

    const spid = new SPiD.default(spidOptions);

    const safePage = `${window.location.origin}/safepage`;

    spid.event.addListener('SPiD.logout', function () {
        alert('Logged out from SPiD. Need to cancel out session');
    });

    // Check session
    spid.hasSession();

    $('#login-user-pass').click(function (e) {
        e.preventDefault();
        spidOptions.popup = $('#usePopup').is(':checked');
        spid.login(safePage);
    });

    $('#login-email').click(function (e) {
        e.preventDefault();
        spidOptions.popup = $('#usePopup').is(':checked');
        spid.login(safePage, 'otp-email');
    });

    $('#login-sms').click(function (e) {
        e.preventDefault();
        spidOptions.popup = $('#usePopup').is(':checked');
        spid.login(safePage, 'otp-sms');
    });

    $('#logout-btn').click(function () {
        // TEMPORARY HACK UNTIL LOGOUT WORKS IN THE browser-sdk API
        $.ajax('/session', { method: 'DELETE' })
            .then(() => alert('Logged out!'))
            .catch((err) => alert(`Could not log out! ${err}`));
    });
});
