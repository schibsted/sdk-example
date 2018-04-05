'use strict';

// Load the .env file if it exists
require('dotenv').config();
const getenv = require('getenv');

const config = {};

config.env = getenv('NODE_ENV', 'development');
config.debug = getenv('NODE_DEBUG', '');
config.port = getenv.int('PORT', 9000);
// The number of milliseconds of inactivity before a socket is presumed to have timed out.
config.socketTimeout = 10000;
config.clientId = getenv('CLIENT_ID');
// clientSecret needs to be generated in self service
config.clientSecret = getenv('CLIENT_SECRET');
// This is used by the JS SDK in the browser. Should be one of LOCAL|DEV|PRE|PRO|PRO.NO|PRO.COM or
config.spidEnv = getenv('SPID_ENV', 'PRE');
// For CORS to work properly in all browsers on localhost
config.enableTLS = getenv.bool('SDK_EXAMPLE_ENABLE_TLS', false);
const protocol = config.enableTLS ? 'https' : 'http'
// the public URL of the server (including port number if it's different from 80)
config.siteOrigin = getenv('SITE_ORIGIN', `${protocol}://localhost:${config.port}`);
// Name of the sessionId cookie
config.cookieName = getenv('COOKIE_NAME', 'sdk-example-session-id');
config.cookieSecret = getenv('COOKIE_SECRET', 'cookie-signing-secret-123456');
// number of milliseconds the session cookie is still recognizable by the server
config.cookieMaxAge = getenv.int('COOKIE_MAX_AGE', 30 * 24 * 60 * 60 * 1000);
// example product id
config.exampleProductId = getenv.int('EXAMPLE_PRODUCT_ID', 10024);
config.oauthBase = getenv('OAUTH_BASE', 'http://localhost:1234');

module.exports = config;
