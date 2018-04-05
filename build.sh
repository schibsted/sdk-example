#!/bin/bash

OPTS="--mode=production --module-bind js=babel-loader --devtool source-map"

rm -rf dist
webpack browser/index.js -o dist/index.js $OPTS
webpack browser/safepage.js -o dist/safepage.js $OPTS
