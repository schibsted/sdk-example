const assert = require('assert');
const http = require('http');
const https = require('https');
const fs = require('fs');

const pkgJson = require('./package.json');
const config = require('./server/config');
const app = require('./server/app');

// Some mandatory config validation
assert(config.clientId, 'client id is missing');
assert(config.clientSecret, 'client secret is missing');

let server;
if (config.enableTLS) {
    const credentials = {
        key: fs.readFileSync('./example_key.pem', 'utf8'),
        cert: fs.readFileSync('./example_server.crt', 'utf8'),
    };
    server = https.createServer(credentials, app);
} else {
    server = http.createServer(app);
}
server.setTimeout(config.socketTimeout);

server.on('error', (err) => {
    console.error('Server error', err);
});

server.listen(config.port, () => {
    console.log(`${pkgJson.name} v${pkgJson.version} is listening on ${config.siteOrigin}...`);
});
