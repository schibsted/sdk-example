'use strict';

const pkgJson = require('./package');
const config = require('./config');
const app = require('./app');

app.listen(config.port, () => {
    console.log(`${pkgJson.name} v${pkgJson.version} listening on ${config.port}...`);
});
