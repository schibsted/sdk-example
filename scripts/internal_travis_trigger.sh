#!/bin/sh

curl -i -s -XPOST \
  -H "Authorization: token ${INTERNAL_TRAVIS_TOKEN}" \
  -H 'Accept: application/json' \
  -H 'Travis-API-Version: 3' \
  -H 'Content-type: application/json' \
  -d '{"request":{"branch":"master"}}' \
  https://travis.schibsted.io/api/repo/spt-identity%2Fsdk-example.com/requests
