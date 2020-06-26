# Contributing to SDK Example

Aww, thanks for wanting to help out :tada:! We would be very grateful if you would discuss your idea
in an issue before implementing it.

## Code of Conduct
The project is governed by the [Schibsted Account Code of Conduct](../CODE_OF_CONDUCT.md). Please
report unacceptable behavior to support@spid.no.

## License
This SDK is released under the [MIT License](../LICENSE.md). Unless you explicitly state otherwise,
any code you submit to us will be released under the same license.

## Practical information
We expect submissions to be consistent with existing code in terms of architecture and coding style.

#### Build project and lint it
```sh
npm install
npm run lint
```

#### Run it

```sh
npm run dev
```

#### Releasing
Releases are meant to be triggered by Travis, but not implemented yet. Tentative thoughts about how
it should work:

1. Update `package.json` with a new version
1. Run `npm install` so that `package-lock.json` is also up-to-date
1. Update `CHANGELOG.md` with relevant changes, in sections **New features**, **Fixes**
1. Commit those changes, push a PR and land it
1. Create a release and name it
   according to the version number you just placed in `package.json`
1. Public Travis should be triggered
1. **WISHY-WASHY stuff here**: When public Travis succeeds, it should do a curl-POST to internal
   Travis to trigger a build in a "fake repo" that just pulls from the public repo, builds docker
   image and pushes to internal docker registry
1. Internal spinnaker should be triggered
