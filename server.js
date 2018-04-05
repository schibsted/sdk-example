'use strict';

const assert = require('assert');
const pkgJson = require('./package');
const config = require('./config');
const app = require('./app');

console.log('Starting the server...');

// Some mandatory config validation
assert(config.clientId, 'client id is missing');
assert(config.clientSecret, 'client secret is missing');

let server;
if (config.enableTLS) {
    const fs = require('fs');
    const https = require('https');
    const credentials = {
        key: fs.readFileSync('./example_key.pem', 'utf8'),
        cert: fs.readFileSync('./example_server.crt', 'utf8')
    };
    server = https.createServer(credentials, app);
} else {
    const http = require('http');
    server = http.createServer(app);
}
server.setTimeout(config.socketTimeout);

server.on('error', (err) => {
    console.error('Server error', err);
});

server.listen(config.port, () => {
    console.log(`${pkgJson.name} v${pkgJson.version} is listening on ${config.siteOrigin}...`);
});
