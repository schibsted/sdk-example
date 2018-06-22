#!/bin/sh

OPTS="--mode=development --module-bind js=babel-loader --devtool eval-cheap-module-source-map --watch"

rm -rf dist
webpack browser/index.js -o dist/index.js $OPTS &
webpack browser/safepage.js -o dist/safepage.js $OPTS &
