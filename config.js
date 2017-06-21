'use strict';

const getenv = require('getenv');

const config = {};

config.env = getenv('NODE_ENV', 'development');
config.debug = getenv('NODE_DEBUG', '');
config.port = getenv.int('PORT', 9000);
config.protocol = getenv('PROTOCOL', 'http');
config.clientId = getenv('CLIENT_ID', '');
// clientSecret needs to be generated in self service
config.clientSecret = getenv('CLIENT_SECRET', '');
// TODO probably remove the trailing slash
config.spidBaseUrl = getenv('SPID_URL', 'http://spp.dev/');
config.paymentServerUrl = getenv('PAYMENT_SERVER_URL', 'http://spp.dev:4100/');
config.hostname = getenv('HOSTNAME', 'localhost');
config.cookieName = getenv('COOKIE_NAME', 'identity-code');
config.cookieSecret = getenv('COOKIE_SECRET', 'cookie-signing-secret-123456');
// TODO this needs to be loaded from CDN
config.sdkJsPath = getenv('SDK_JS_PATH', 'https://d3iwtia3ndepsv.cloudfront.net/sdk/0.0.19/schibsted-browser-sdk.js');

module.exports = config;
