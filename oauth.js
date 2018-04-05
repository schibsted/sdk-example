const { Strategy } = require('passport-oauth2-middleware');
const Introspection = require('token-introspection');
const OAuth2Strategy = require('passport-oauth2');
const passport = require('passport');
const request = require('request-promise');
const jwt = require('jsonwebtoken');

const config = require('./config');

const introspector = new Introspection({
    endpoint: `${config.oauthBase}oauth/introspect`,
    jwks_uri: `${config.oauthBase}oauth/jwks`,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    allowed_algs: ['HS256', 'RS256'],
});

function initialize(app) {
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));

    const refreshStrategy = new Strategy({
        refreshWindow: 20, // Time in seconds to perform a token refresh before it expires
        userProperty: 'ticket', // Active user property name to store OAuth tokens (so req.user.ticket...)
        authenticationURL: '/oauth', // URL to redirect unathorized users to
    });

    passport.use('main', refreshStrategy);  //Main authorization strategy that authenticates

    function skipUserProfile(token, done) {
        try {
            const data = jwt.decode(token); // Yeah, let's trust the token rather than introspect...
            done(null, !(data && data.scope && data.scope.split(' ').includes('openid')));
        } catch (e) {
            done(e);
        }
    }

    var oauthStrategy = new OAuth2Strategy({
        authorizationURL: `${config.oauthBase}oauth/authorize`,
        tokenURL: `${config.oauthBase}oauth/token`,
        clientID: config.clientId,
        clientSecret: config.clientSecret,
        callbackURL: `${config.siteOrigin}/safepage`,
        skipUserProfile,
    },
    refreshStrategy.getOAuth2StrategyCallback() //Create a callback for OAuth2Strategy
    );

    oauthStrategy.userProfile = async (token, done) => {
        try {
            const opts = { headers: { authorization: `Bearer ${token}` } };
            const userinfo = JSON.parse(await request.get(`${config.oauthBase}oauth/userinfo`, opts));
            done(null, { userinfo });
        } catch (e) {
            done(e);
        }
    };

    const state = Buffer.from(JSON.stringify({ foo: 'bar' })).toString('base64');
    oauthStrategy.authorizationParams = () => ({ scope: 'openid profile', 'new-flow': 'true', state });

    passport.use('oauth', oauthStrategy); //Strategy to perform regular OAuth2 code grant workflow
    refreshStrategy.useOAuth2Strategy(oauthStrategy);

    app.get('/oauth', passport.authenticate('oauth'));
}

module.exports = {
    initialize,
    introspector,
    passport,
}
