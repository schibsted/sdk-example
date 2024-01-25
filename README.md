# SDK Example

[![Build Status](https://github.com/schibsted/sdk-example/actions/workflows/pt.yml/badge.svg?branch=master)](https://github.com/schibsted/sdk-example)

## Introduction

This is a demonstration of how a client can use the Schibsted Account login flows. You can see it
live at:

* [https://pro.sdk-example.com](https://pro.sdk-example.com)
* [https://pre.sdk-example.com](https://pre.sdk-example.com)
* [https://dev.sdk-example.com](https://dev.sdk-example.com)

The main intention of this code is to have a simplified demo of the most important features of [SDK for browsers](https://github.com/schibsted/account-sdk-browser)

## How to run it locally?
1. Clone this repo.
1. Install dependencies `npm run install`.
1. And run `npm run dev` script.

## Configuring the server

1. You need a few configs obtained from Self-Service *in the right environment* in order to get
   started. Set your Identity client credentials in the `.env` file in the root folder. To get a
   head start you can just copy a template that's already included in the repo (run: `cp
   .env-example .env` and fill in the blanks. Take a look at [.env-example](./.env-example) to
   see what is needed.
1. Then do a `source .env && npm start` or `npm run dev`.

## Repository structure
For this Example app a simple backend application is exposed.

### Backend
The contents for the backend application can be found in the `/server` directory.

### Account-sdk-browser usage
The frontend code is placed in the `/public` directory, and usage of SDK can be found in [index.js](public/index.js).
