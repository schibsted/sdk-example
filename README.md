# SDK Example

[![Build Status](https://travis-ci.org/schibsted/sdk-example.svg?branch=master)](https://travis-ci.org/schibsted/sdk-example)

## Introduction

This is a demonstration of how a client can use the Schibsted Account login flows. You can see it
live at:

* [https://pro.sdk-example.com](https://pro.sdk-example.com) (for development)

Its main intention is *code as documentation* and is intentionally simplified to demo the most
important steps for using the [SDK](https://github.com/schibsted/account-sdk-browser).

Take a quick look at its browser code in [index.js](./browser/index.js) and its server code in
[app.js](./app.js).

## Installation

1. Clone this repo
1. Run `npm install`.

## Configuring the server

1. You need a few configs obtained from Self-service *in the right environment* in order to get
   started. Set your Identity client credentials in the `.env` file in the root folder. To get a
   head start you can just copy a template that's already included in the repo (run: `cp
   .env-template .env` and fill in the blanks. Take a look at [.env-template](./.env-template) to
   see what is needed.
1. Then do a `source .env && npm start` or `npm run dev`.

## VSCode batteries included

If you're using VS Core it's super easy. Just choose the debug menu and launch "SDK-Example-DEV".
It's automatically load the configuration from the `.env` file you created previously.
