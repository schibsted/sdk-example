# Basic rules

1. Discuss your idea in an issue before implementing it.
2. Add tests for new features or bug fixes.
3. Lint your code before making a PR.

# Publishing

`npm version <major|minor|patch>` runs lints, tests, checks the documentation (plus a few other
things that can be seen in `package.json:scripts`) and tags and pushes it to git.
Then travis picks it up and deploys it to npm. The whole process is automated to use that command
carefully.
