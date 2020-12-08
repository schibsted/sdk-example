'use strict';

const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const config = require('./config');
const pkgJson = require('./package');
const asyncMW = require('./asyncMW');
const filterExt = require('./filterExt');
const oauth = require('./oauth');

const app = express();

app.set('views', `${__dirname}/browser`);
// @see https://github.com/pillarjs/hbs
app.set('view engine', 'hbs');

app.use(helmet());

app.get('/healthcheck', (req, res) => res.status(200).end());

app.use(cookieParser());

app.use(session({
    name: config.cookieName,
    rolling: true,
    saveUninitialized: false,
    secret: config.cookieSecret,
    unset: 'destroy',
    resave: false,
    cookie: { httpOnly: true, sameSite: 'lax' }
}));

oauth.initialize(app);

app.get('/', asyncMW(async (req, res) => {
    const data = { pkgJson, config };
    if (req.isAuthenticated()) {
        if (!req.user.userinfo) {
            // We came from a purchase flow, and our token doesn't have the 'openid' scope. Let's
            // try to redirect to /oauth to "quickly fetch" a token
            return res.redirect('/oauth');
        }
        data.userInfo = req.user.userinfo;
    }
    res.render('index', data);
}));

app.get('/userinfo', (req, res) => {
    if (req.isAuthenticated() && req.user.userinfo) {
        return res.json(req.user.userinfo);
    }
    res.status(401).send(`No token with 'openid' scope available`);
});

app.get('/isloggedin', (req, res) => res.send({ isLoggedin: req.isAuthenticated() }));

app.get('/safepage', oauth.passport.authenticate('oauth'), asyncMW(async (req, res, next) => {
    const state = {};
    if (req.query.state) {
        const stateString = Buffer.from(req.query.state, 'base64').toString();
        Object.assign(state, JSON.parse(stateString));
    }
    if (req.query.order_id) {
        console.log('Congratulations! You purchased something');
    }
    if (state.popup) {
        res.render('safepage');
    } else {
        res.redirect('/');
    }
}));

app.get('/session-exchange-safepage', oauth.passport.authenticate('oauth'), asyncMW(async (req, res) => {
    const state = {};
    if (req.query.state) {
        const stateString = Buffer.from(req.query.state, 'base64').toString();
        Object.assign(state, JSON.parse(stateString));
    } else {
        console.log(`No state was returned. We expect that to be present if you came back from a`
        + ` login attempt, and should be set when the frontend calls 'login(...)'`);
    }
    if (state.popup) {
        res.render('safepage');
    } else {
        res.redirect('/');
    }
}));

app.get('/introspect', asyncMW(async (req, res, next) => {
    try {
        if (!req.isAuthenticated()) {
            throw new Error('Not authenticated');
        }
        res.send(await oauth.introspector(req.user.ticket.access_token, 'access_token'));
    } catch (error) {
        console.error(`Token introspection failed: ${error.message}`);
        res.send(error.message);
    }
}));

app.get('/logout', (req, res) => {
    req.logout();
    // Destroy the session and any possible data we might have for the user
    // @see https://www.npmjs.com/package/express-session#sessiondestroycallback
    req.session.destroy(() => res.redirect('/'));
});

app.get('/.well-known/apple-app-site-association', (_, res) => {
    if (config.iosAppIds) {
        res.json({'applinks':{'details':[{'appIDs':config.iosAppIds,'components':[{'/':'/ios_app_login/*'}]}]}})
    } else {
        res.end();
    }
});

app.use('/browser', filterExt('css', 'ico'), express.static(`${__dirname}/browser`));
app.get('/favicon.ico', (req, res) => res.redirect('/browser/favicon.ico'));
app.get('/apple-touch-icon-precomposed.png', (_, res) => res.status(404));
app.get('/apple-touch-icon.png', (_, res) => res.status(404));
app.use('/dist', express.static('dist'));

// For any route not found
app.use((req, res, next) => {
    const error = new Error(`Invalid route: ${req.originalUrl}`);
    error.status = 404;
    next(error);
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Express error handler is called (a middleware thrown): ', err);
    if (typeof err !== 'object' || err === null) {
        err = { name: `NON-OBJECT ERROR: ${String(err)}` };
    }
    const status = err.status || 500;
    res.status(status).render('error', {
        status,
        message: err.message || 'No error message',
        name: err.name || 'No error name',
        stack: err.stack || 'No stack trace is available'
    });
});

module.exports = app;
