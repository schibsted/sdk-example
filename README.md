# SDK Example

[![Build Status](https://travis-ci.org/schibsted/sdk-example.svg?branch=master)](https://travis-ci.org/schibsted/sdk-example)

## Introduction

This is a demonstration of how a client can use the Schibsted Account login flows. You can see it
live at:

* [https://pro.sdk-example.com](https://pro.sdk-example.com)
* [https://pre.sdk-example.com](https://pre.sdk-example.com)
* [https://dev.sdk-example.com](https://dev.sdk-example.com)

The main intention of this code is to have simplified demo of the most important features of [SDK](https://github.com/schibsted/account-sdk-browser)

## How to run locally?
1. Clone this repo.
1. Install dependencies `npm run install`.
1. And run `npm run dev` script.

## Configuring the server

1. You need a few configs obtained from Self-service *in the right environment* in order to get
   started. Set your Identity client credentials in the `.env` file in the root folder. To get a
   head start you can just copy a template that's already included in the repo (run: `cp
   .env-example .env` and fill in the blanks. Take a look at [.env-example](./.env-example) to
   see what is needed.
1. Then do a `source .env && npm start` or `npm run dev`.

## Repo structure
To make this Example app running, simple backend application is exposed.

### Backend
Main directory for backend application is placed directory
```
/server
```

### Account-sdk-browser usage
All browser code is placed in `/public` directory, and usage of SDK can be found in this file [index.js](public/index.js)
