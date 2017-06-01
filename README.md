# Intro

WIP
Ask questions on Slack #spt-identity-web-ex
This is just a demonstration of how a client can use the new login flows.

# ClientId and Client secret

We're reusing Aftonbladet's clientId for now. It's in the config.js file.
But you need to generate a unique client secret from 
[spp.dev/selfservice](http://spp.dev/merchant/46001/client/4e8463569caf7ca019000007/generate)
and put it in the config.js as well.

# Prepare your environment

1. Run `spid-platform` on the `idweb-155-new-oauth-flow` branch
2. Clone and build the SDK:
    * `git clone git@github.schibsted.io:spt-identity/identity-web-sdk.git`
    * For now: `git checkout popup-login`
    * Install deps and build: `yarn && yarn run build`
3. Clone and build Frontend:
    * `git clone git@github.schibsted.io:spt-identity/identity-web-frontend.git`
    * Install deps and build: `yarn && yarn run build`
4. Clone and run the BFF:
    * `git clone git@github.schibsted.io:spt-identity/identity-web-bff.git`
    * Install deps and serve: `yarn && yarn start`
5. Install deps and run this example:
    * `yarn && yarn start`
    * For development mode (with log messages): `yarn run dev`
