![Project Logo](https://lh6.googleusercontent.com/-YmfKZZLZKL0/U-KVPFSbiOI/AAAAAAAAEZA/maoYT8iJCnA/w1089-h513-no/sshot-1.png)

# [Satellizer](https://github.com/sahat/satellizer/) 

[![Join the chat at https://gitter.im/sahat/satellizer](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/sahat/satellizer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](http://img.shields.io/travis/sahat/satellizer.svg?style=flat)](https://travis-ci.org/sahat/satellizer)
[![Test Coverage](http://img.shields.io/codeclimate/coverage/github/sahat/satellizer.svg?style=flat)](https://codeclimate.com/github/sahat/satellizer)
[![Version](https://img.shields.io/npm/v/satellizer.svg)](https://www.npmjs.org/package/satellizer)

**Live Demo:** [https://satellizer.herokuapp.com](https://satellizer.herokuapp.com)

---

**Satellizer** is a simple to use, end-to-end, token-based authentication module
for [AngularJS](http://angularjs.org) with built-in support for Google, Facebook,
LinkedIn, Twitter, GitHub, Yahoo, Twitch, Microsoft OAuth providers, as well as Email
and Password sign-in. However, you are not limited to the sign-in options above, in fact
you can add any *OAuth 1.0* or *OAuth 2.0* provider by passing provider-specific information
in the app *config* block.

![Screenshot](https://lh4.googleusercontent.com/-0UUIecT-3N4/U-LQJkd75iI/AAAAAAAAEZY/YN3Oe-eUPGc/w1676-h1158-no/satellizer.png)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Browser Support](#browser-support)
- [Authentication Flow](#authentication-flow)
 - [Login with Email and Password](#-login-with-email-and-password)
 - [Login with OAuth 1.0](#-login-with-oauth-10)
 - [Login with OAuth 2.0](#-login-with-oauth-20)
 - [Logout](#-logout)
- [Obtaining OAuth Keys](#obtaining-oauth-keys)
- [API Reference](#api-reference)
- [FAQ](#faq)
 - [How can I send a token in a format other than `Authorization: Bearer <token>?`](#how-can-i-send-a-token-in-a-format-other-than-authorization-bearer-token)
 - [How can I avoid sending Authorization header on all HTTP requests?](#how-can-i-avoid-sending-authorization-header-on-all-http-requests)
 - [Is there a way to dynamically change `localStorage` to `sessionStorage`?](#is-there-a-way-to-dynamically-change-localstorage-to-sessionstorage)
- [Credits](#credits)
- [License](#license)

## Installation

The easiest way to get **Satellizer** is by running one of the following
commands:

```bash
# Bower
bower install satellizer

# NPM
npm install satellizer
```

Alternatively, you may [**download**](https://github.com/sahat/satellizer/releases) the latest release or use the CDN:

```html
<!--[if lte IE 9]>
<script src="//cdnjs.cloudflare.com/ajax/libs/Base64/0.3.0/base64.min.js"></script>
<![endif]-->
<script src="//cdn.jsdelivr.net/satellizer/0.13.1/satellizer.min.js"></script>
```

**Note:** Sattelizer depends on [`window.atob()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/atob) for decoding JSON Web Tokens. If you need to support *IE9* then use Base64 polyfill above.


## Usage

**Step 1. App Module**
```js
angular.module('MyApp', ['satellizer'])
  .config(function($authProvider) {

    $authProvider.facebook({
      clientId: 'Facebook App ID'
    });

    $authProvider.google({
      clientId: 'Google Client ID'
    });

    $authProvider.github({
      clientId: 'GitHub Client ID'
    });

    $authProvider.linkedin({
      clientId: 'LinkedIn Client ID'
    });
    
    $authProvider.instagram({
      clientId: 'Instagram Client ID'
    });

    $authProvider.yahoo({
      clientId: 'Yahoo Client ID / Consumer Key'
    });

    $authProvider.live({
      clientId: 'Microsoft Client ID'
    });

    $authProvider.twitch({
      clientId: 'Twitch Client ID'
    });

    // No additional setup required for Twitter

    $authProvider.oauth2({
      name: 'foursquare',
      url: '/auth/foursquare',
      clientId: 'Foursquare Client ID',
      redirectUri: window.location.origin,
      authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate',
    });

  });
```

**Step 2. Controller**
```js
angular.module('MyApp')
  .controller('LoginCtrl', function($scope, $auth) {

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider);
    };

  });
```

**Step 3. Template**
```html
<button ng-click="authenticate('facebook')">Sign in with Facebook</button>
<button ng-click="authenticate('google')">Sign in with Google</button>
<button ng-click="authenticate('github')">Sign in with GitHub</button>
<button ng-click="authenticate('linkedin')">Sign in with LinkedIn</button>
<button ng-click="authenticate('instagram')">Sign in with Instagram</button>
<button ng-click="authenticate('twitter')">Sign in with Twitter</button>
<button ng-click="authenticate('foursquare')">Sign in with Foursquare</button>
<button ng-click="authenticate('yahoo')">Sign in with Yahoo</button>
<button ng-click="authenticate('live')">Sign in with Windows Live</button>
<button ng-click="authenticate('twitch')">Sign in with Twitch</button>
```

**Note:** For server-side usage please refer to the [**examples**](https://github.com/sahat/satellizer/tree/master/examples/server)
directory.

## Configuration

Below is a complete listing of all default configuration options.

```js
httpInterceptor: function() { return true; },
$authProvider.withCredentials = true;
$authProvider.tokenRoot = null;
$authProvider.cordova = false;
$authProvider.baseUrl = '/';
$authProvider.loginUrl = '/auth/login';
$authProvider.signupUrl = '/auth/signup';
$authProvider.unlinkUrl = '/auth/unlink/';
$authProvider.tokenName = 'token';
$authProvider.tokenPrefix = 'satellizer';
$authProvider.authHeader = 'Authorization';
$authProvider.authToken = 'Bearer';
$authProvider.storageType = 'localStorage';

// Facebook
$authProvider.facebook({
  name: 'facebook',
  url: '/auth/facebook',
  authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
  redirectUri: window.location.origin + '/',
  requiredUrlParams: ['display', 'scope'],
  scope: ['email'],
  scopeDelimiter: ',',
  display: 'popup',
  type: '2.0',
  popupOptions: { width: 580, height: 400 }
});

// Google
$authProvider.google({
  url: '/auth/google',
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
  redirectUri: window.location.origin,
  requiredUrlParams: ['scope'],
  optionalUrlParams: ['display'],
  scope: ['profile', 'email'],
  scopePrefix: 'openid',
  scopeDelimiter: ' ',
  display: 'popup',
  type: '2.0',
  popupOptions: { width: 452, height: 633 }
});

// GitHub
$authProvider.github({
  url: '/auth/github',
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  redirectUri: window.location.origin,
  optionalUrlParams: ['scope'],
  scope: ['user:email'],
  scopeDelimiter: ' ',
  type: '2.0',
  popupOptions: { width: 1020, height: 618 }
});

// Instagram
$authProvider.instagram({
  name: 'instagram',
  url: '/auth/instagram',
  authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
  redirectUri: window.location.origin,
  requiredUrlParams: ['scope'],
  scope: ['basic'],
  scopeDelimiter: '+',
  type: '2.0'
});

// LinkedIn
$authProvider.linkedin({
  url: '/auth/linkedin',
  authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
  redirectUri: window.location.origin,
  requiredUrlParams: ['state'],
  scope: ['r_emailaddress'],
  scopeDelimiter: ' ',
  state: 'STATE',
  type: '2.0',
  popupOptions: { width: 527, height: 582 }
});

// Twitter
$authProvider.twitter({
  url: '/auth/twitter',
  authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
  redirectUri: window.location.origin,
  type: '1.0',
  popupOptions: { width: 495, height: 645 }
});

// Twitch
$authProvider.twitch({
  url: '/auth/twitch',
  authorizationEndpoint: 'https://api.twitch.tv/kraken/oauth2/authorize',
  redirectUri: window.location.origin,
  requiredUrlParams: ['scope'],
  scope: ['user_read'],
  scopeDelimiter: ' ',
  display: 'popup',
  type: '2.0',
  popupOptions: { width: 500, height: 560 }
});

// Windows Live
$authProvider.live({
  url: '/auth/live',
  authorizationEndpoint: 'https://login.live.com/oauth20_authorize.srf',
  redirectUri: window.location.origin,
  requiredUrlParams: ['display', 'scope'],
  scope: ['wl.emails'],
  scopeDelimiter: ' ',
  display: 'popup',
  type: '2.0',
  popupOptions: { width: 500, height: 560 }
});

// Yahoo
$authProvider.yahoo({
  url: '/auth/yahoo',
  authorizationEndpoint: 'https://api.login.yahoo.com/oauth2/request_auth',
  redirectUri: window.location.origin,
  scope: [],
  scopeDelimiter: ',',
  type: '2.0',
  popupOptions: { width: 559, height: 519 }
});

// Generic OAuth 2.0
$authProvider.oauth2({
  name: null,
  url: null,
  clientId: null,
  redirectUri: null,
  authorizationEndpoint: null,
  defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
  requiredUrlParams: null,
  optionalUrlParams: null,
  scope: null,
  scopePrefix: null,
  scopeDelimiter: null,
  state: null,
  type: null,
  popupOptions: null,
  responseType: 'code',
  responseParams: {
    code: 'code',
    clientId: 'clientId',
    redirectUri: 'redirectUri'
  }
});

// Generic OAuth 1.0
$authProvider.oauth1({
  name: null,
  url: null,
  authorizationEndpoint: null
  redirectUri: null,
  type: null,
  popupOptions: null
});
```

## Browser Support

<table>
  <tbody>
    <tr>
      <td><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Internet_Explorer_9_icon.svg/2000px-Internet_Explorer_9_icon.svg.png" height="35"></td>
      <td><img src="http://vignette1.wikia.nocookie.net/unanything/images/f/ff/Microsoft_Edge_logo_svg.png/revision/latest?cb=20150728233335" height="35"></td>
      <td><img src="http://img4.wikia.nocookie.net/__cb20140907211937/logopedia/images/b/b6/Chrome_new_logo.png" height="35"></td>
      <td><img src="http://media.idownloadblog.com/wp-content/uploads/2014/06/Safari-logo-OS-X-Yosemite.png" height="35"></td>
      <td><img src="https://mozorg.cdn.mozilla.net/media/img/styleguide/identity/firefox/guidelines-logo.7ea045a4e288.png" height="35"></td>
      <td><img src="http://upload.wikimedia.org/wikipedia/commons/d/d4/Opera_browser_logo_2013.png" height="35"></td>
    </tr>
    <tr>
      <td align="center">9*</td>
      <td align="center">✓</td>
      <td align="center">✓</td>
      <td align="center">✓</td>
      <td align="center">✓</td>
      <td align="center">✓</td>
    </tr>
  </tbody>
</table>

__*__ Requires [Base64](https://github.com/davidchambers/Base64.js/) polyfill.

## Authentication Flow

Satellizer relies on *token-based authentication* using
[JSON Web Tokens](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/)
instead of cookies.

### <img height="34" align="top" src="http://tech-lives.com/wp-content/uploads/2012/03/Lock-icon.png"> Login with Email and Password

1. <img height="24" align="top" src="https://i.ytimg.com/i/bn1OgGei-DV7aSRo_HaAiw/mq1.jpg?v=4f8f2cc9"> **Client:** Enter your email and password into the login form.
2. <img height="24" align="top" src="https://i.ytimg.com/i/bn1OgGei-DV7aSRo_HaAiw/mq1.jpg?v=4f8f2cc9"> **Client:** On form submit call `$auth.login()` with email and password.
3. <img height="24" align="top" src="https://i.ytimg.com/i/bn1OgGei-DV7aSRo_HaAiw/mq1.jpg?v=4f8f2cc9"> **Client:** Send a `POST` request to `/auth/login`.
4. <img height="24" align="top" src="http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/256/Places-network-server-database-icon.png"> **Server:** Check if email exists, if not - return `401`.
5. <img height="24" align="top" src="http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/256/Places-network-server-database-icon.png"> **Server:** Check if password is correct, if not - return `401`.
6. <img height="24" align="top" src="http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/256/Places-network-server-database-icon.png"> **Server:** Create a JSON Web Token and send it back to the client.
7. <img height="24" align="top" src="https://i.ytimg.com/i/bn1OgGei-DV7aSRo_HaAiw/mq1.jpg?v=4f8f2cc9"> **Client:** Parse the token and save it to *Local Storage* for subsequent
use after page reload.


### <img height="34" align="top" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Oauth_logo.svg/180px-Oauth_logo.svg.png"> Login with OAuth 1.0

1. <img height="24" align="top" src="https://i.ytimg.com/i/bn1OgGei-DV7aSRo_HaAiw/mq1.jpg?v=4f8f2cc9"> **Client:** Open an **empty** popup window via `$auth.authenticate('provider name')`.
2. <img height="24" align="top" src="https://i.ytimg.com/i/bn1OgGei-DV7aSRo_HaAiw/mq1.jpg?v=4f8f2cc9"> **Client:** Unlike OAuth 2.0, with OAuth 1.0 you cannot go directly to the authorization 
screen without a valid `request_token`.
3. <img height="24" align="top" src="https://i.ytimg.com/i/bn1OgGei-DV7aSRo_HaAiw/mq1.jpg?v=4f8f2cc9"> **Client:** The OAuth 1.0 flow starts with an empty **POST** request to */auth/provider*.
4. <img height="24" align="top" src="http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/256/Places-network-server-database-icon.png"> **Server:** Obtain and return `request_token`for the authorization popup.
5. <img height="24" align="top" src="https://i.ytimg.com/i/bn1OgGei-DV7aSRo_HaAiw/mq1.jpg?v=4f8f2cc9"> **Client:** Set the URL location of a popup to the `authorizationEndpoint` with a valid `request_token` query parameter, as well as popup options for height and width. This will redirect a user to the authorization screen. After this point, the flow is very similar to OAuth 2.0.
6. <img height="24" align="top" src="https://i.ytimg.com/i/bn1OgGei-DV7aSRo_HaAiw/mq1.jpg?v=4f8f2cc9"> **Client:** Sign in with your username and password if necessary, then authorize
the application.
7. <img height="24" align="top" src="https://i.ytimg.com/i/bn1OgGei-DV7aSRo_HaAiw/mq1.jpg?v=4f8f2cc9"> **Client:** Send a *POST* request back to the */auth/provider* with 
`oauth_token` and `oauth_verifier` query parameters.
8. <img height="24" align="top" src="http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/256/Places-network-server-database-icon.png"> **Server:** Do an OAuth-signed `POST` request to the */access_token* URL since we now have `oauth_token` and 
`oauth_verifier` parameters.
10. <img height="24" align="top" src="http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/256/Places-network-server-database-icon.png"> **Server:** Look up the user by their unique *Provider ID*. If user already 
exists, grab the existing user, otherwise create a new user account.
11. <img height="24" align="top" src="http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/256/Places-network-server-database-icon.png"> **Server:** Create a JSON Web Token and send it back to the client.
12. <img height="24" align="top" src="https://i.ytimg.com/i/bn1OgGei-DV7aSRo_HaAiw/mq1.jpg?v=4f8f2cc9"> **Client:** Parse the token and save it to *Local Storage* for subsequent
use after page reload.


### <img height="34" align="top" src="https://getkong.org/assets/images/icons/plugins/oauth2-authentication.png"> Login with OAuth 2.0

1. <img height="24" align="top" src="https://i.ytimg.com/i/bn1OgGei-DV7aSRo_HaAiw/mq1.jpg?v=4f8f2cc9"> **Client:** Open a popup window via `$auth.authenticate('provider name')`.
2. <img height="24" align="top" src="https://i.ytimg.com/i/bn1OgGei-DV7aSRo_HaAiw/mq1.jpg?v=4f8f2cc9"> **Client:** Sign in with that provider, if necessary, then authorize the application.
3. <img height="24" align="top" src="https://i.ytimg.com/i/bn1OgGei-DV7aSRo_HaAiw/mq1.jpg?v=4f8f2cc9"> **Client:** After successful authorization, the popup is redirected back to 
your app, e.g. *http://localhost:3000*,  with the `code` (authorization code)
query string parameter.
4. <img height="24" align="top" src="https://i.ytimg.com/i/bn1OgGei-DV7aSRo_HaAiw/mq1.jpg?v=4f8f2cc9"> **Client:** The `code` parameter is sent back to the  parent window that opened the popup.
5. <img height="24" align="top" src="https://i.ytimg.com/i/bn1OgGei-DV7aSRo_HaAiw/mq1.jpg?v=4f8f2cc9"> **Client:** Parent window closes the popup and sends a **POST** 
request to */auth/provider* with`code` parameter.
6. <img height="24" align="top" src="http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/256/Places-network-server-database-icon.png"> **Server:** *Authorization code* is exchanged for *access token*.
7. <img height="24" align="top" src="http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/256/Places-network-server-database-icon.png"> **Server:** User information is retrived using the *access token* from **Step 6**.
8. <img height="24" align="top" src="http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/256/Places-network-server-database-icon.png"> **Server:** Look up the user by their unique *Provider ID*. If user already 
exists, grab the existing user, otherwise create a new user account.
9. <img height="24" align="top" src="http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/256/Places-network-server-database-icon.png"> **Server:** In both cases of Step 8, create a JSON Web Token and send it back to the client.
10. <img height="24" align="top" src="https://i.ytimg.com/i/bn1OgGei-DV7aSRo_HaAiw/mq1.jpg?v=4f8f2cc9"> **Client:** Parse the token and save it to *Local Storage* for subsequent
use after page reload.

### <img height="34" align="top" src="http://uxrepo.com/static/icon-sets/font-awesome/svg/logout.svg"> Logout
1. <img height="24" align="top" src="https://i.ytimg.com/i/bn1OgGei-DV7aSRo_HaAiw/mq1.jpg?v=4f8f2cc9"> **Client:** Remove token from Local Storage.

**Note:** To learn more about JSON Web Tokens visit <img src="http://jwt.io/img/pic_logo.svg" height="22" align="top"> [JWT.io](http://jwt.io/).

## Obtaining OAuth Keys

<img src="http://images.google.com/intl/en_ALL/images/srpr/logo6w.png" width="150">
- Visit [Google Cloud Console](https://cloud.google.com/console/project)
- Click **CREATE PROJECT** button
- Enter *Project Name*, then click **CREATE**
- Then select *APIs & auth* from the sidebar and click on *Credentials* tab
- Click **CREATE NEW CLIENT ID** button
 - **Application Type**: Web Application
 - **Authorized Javascript origins**: *http://localhost:3000*
 - **Authorized redirect URI**: *http://localhost:3000*

**Note:** Make sure you have turned on **Contacts API** and **Google+ API** in the *APIs* tab.

<hr>

<img src="http://www.doit.ba/img/facebook.jpg" width="150">
- Visit [Facebook Developers](https://developers.facebook.com/)
- Click **Apps > Create a New App** in the navigation bar
- Enter *Display Name*, then choose a category, then click **Create app**
- Click on *Settings* on the sidebar, then click **+ Add Platform**
- Select **Website**
- Enter *http://localhost:3000* for *Site URL*

<hr>

<img src="https://g.twimg.com/Twitter_logo_blue.png" height="70">
- Sign in at [https://apps.twitter.com](https://apps.twitter.com/)
- Click on **Create New App**
- Enter your *Application Name*, *Description* and *Website*
- For **Callback URL**: *http://127.0.0.1:3000*
- Go to **Settings** tab
- Under *Application Type* select **Read and Write** access
- Check the box **Allow this application to be used to Sign in with Twitter**
- Click **Update this Twitter's applications settings**

<hr>

<img src="http://blogs.unity3d.com/wp-content/uploads/2013/12/New-Microsoft-Logo.png" width="150">
- Visit [Live Connect App Management](http://go.microsoft.com/fwlink/p/?LinkId=193157).
- Click on **Create application**
- Enter an *Application name*, then click on **I accept** button
- Go to **API Settings** tab
- Enter a *Redirect URL*
- Click **Save**
- Go to **App Settings** tab to get *Client ID* and *Client Secret*

> **Note:** Microsoft does not consider `localhost` or `127.0.0.1` to be a valid URL.
As a workaround for local development add `127.0.0.1 mylocalwebsite.net` to **/etc/hosts** file
and specify `mylocalwebsite.net` as your *Redirect URL* in the **API Settings** tab.


## API Reference

- [`$auth.login(user, [options])`](#authloginuser-options)
- [`$auth.signup(user, [options])`](#authsignupuser-options)
- [`$auth.authenticate(name, [userData])`](#authauthenticatename-userdata)
- [`$auth.logout()`](#authlogout)
- [`$auth.isAuthenticated()`](#authisauthenticated)
- [`$auth.link(name, [userData])`](#authlinkname-userdata)
- [`$auth.unlink(name, [options])`](#authunlinkname-options)
- [`$auth.getToken()`](#authgettoken)
- [`$auth.getPayload()`](#authgetpayload)
- [`$auth.setToken(token)`](#authsettokentoken)
- [`$auth.removeToken()`](#authremovetoken)
- [`$auth.setStorageType(type)`](#authsetstoragetypetype)

#### `$auth.login(user, [options])`

Sign in using Email and Password.

##### Parameters

| Param                    | Type     | Details
| ------------------------ | -------- | ---------------------------------------------------------------------------------------
| **user**                 | `Object` | JavaScript object containing user information.
| **options** *(optional)* | `Object` | HTTP config object. See [`$http(config)`](https://docs.angularjs.org/api/ng/service/$http) docs.

##### Returns

- **response** - The HTTP response object from the server.

##### Usage

```js
var user = {
  email: $scope.email,
  password: $scope.password
};

$auth.login(user)
  .then(function(response) {
    // Redirect user here after a successful log in.
  })
  .catch(function(response) {
    // Handle errors here, such as displaying a notification
    // for invalid email and/or password.
  });
```

<hr>

#### `$auth.signup(user, [options])`

Create a new account with Email and Password.

##### Parameters

| Param                    | Type     | Details
| ------------------------ | -------- | ---------------------------------------------------------------------------------------
| **user**                 | `Object` | JavaScript object containing user information.
| **options** *(optional)* | `Object` | HTTP config object. See [`$http(config)`](https://docs.angularjs.org/api/ng/service/$http) docs.

##### Returns

- **response** - The HTTP response object from the server.

##### Usage

```js
var user = {
  firstName: $scope.firstName,
  lastName: $scope.lastName,
  email: $scope.email,
  password: $scope.password
};

$auth.signup(user)
  .then(function(response) {
    // Redirect user here to login page or perhaps some other intermediate page
    // that requires email address verification before any other part of the site
    // can be accessed.
  })
  .catch(function(response) {
    // Handle errors here.
  });
```

<hr>

#### `$auth.authenticate(name, [userData])`

Starts the OAuth 1.0 or the OAuth 2.0 authorization flow by opening a popup window.

##### Parameters

| Param                     | Type     | Details
| ------------------------- | -------- | --------------------------------------------------------------------------------
| **name**                  | `String` | One of the built-in or custom OAuth provider names created via `$authProvider.oauth1()` or `$authProvider.oauth2()`.
| **userData** *(optional)* | `Object` | If you need to send additional data to the server along with `code`, `clientId` and `redirectUri` (OAuth 2.0) or `oauth_token` and `oauth_verifier` (OAuth 1.0).

##### Returns

- **response** - The HTTP response object from the server.

##### Usage

```js
$auth.authenticate('google')
  .then(function(response) {
    // Signed in with Google.
  })
  .catch(function(response) {
    // Something went wrong.
  });
```

<hr>

#### `$auth.logout()`

Deletes a token from Local Storage (or Session Storage).

##### Usage

```js
$auth.logout();
```

<hr>

#### `$auth.isAuthenticated()`

Checks authentication status of a user.

| State                                  | True     | False
| -------------------------------------- | -------- | -------
| No token in Local Storage              |          | ✓
| Token present, but not a valid JWT     | ✓        |
| JWT present without [`exp`]((http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html#expDef))              | ✓        |
| JWT present with [`exp`]((http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html#expDef)) and not expired | ✓        |
| JWT present with [`exp`]((http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html#expDef)) and expired     |          | ✓

##### Usage

```js
// Controller
$scope.isAuthenticated = function() {
  return $auth.isAuthenticated();
};
```

```html
<!-- Template -->
<ul ng-if="!isAuthenticated()">
  <li><a href="/login">Login</a></li>
  <li><a href="/signup">Sign up</a></li>
</ul>
<ul ng-if="isAuthenticated()">
  <li><a href="/logout">Logout</a></li>
</ul>
```

<hr>

#### `$auth.link(name, [userData])`

Alias for [`$auth.authenticate(name, [userData])`](#authauthenticatename-userdata).

:bulb: **Note:** Account linking (and merging) business logic is handled entirely on the server.

##### Usage

```js
// Controller
$scope.link = function(provider) {
  $auth.link(provider)
    .then(function(response) {
      // You have successfully linked an account.
    })
    .catch(function(response) {
      // Handle errors here.
    });
};
```

```html
<!-- Template -->
<button ng-click="link('facebook')">
  Connect Facebook Account
</button>
```
<hr>

#### `$auth.unlink(name, [options])`

Unlinks an OAuth provider.

By default, sends a POST request to `/auth/unlink` with the `{ provider: name }` data object.

##### Parameters

| Param                     | Type     | Details
| ------------------------- | -------- | --------------------------------------------------------------------------------
| **name**                  | `String` | One of the built-in or custom OAuth provider names created via `$authProvider.oauth1()` or `$authProvider.oauth2()`.
| **options** *(optional)*  | `Object` | HTTP config object. See [`$http(config)`](https://docs.angularjs.org/api/ng/service/$http) docs.


##### Returns

- **response** - The HTTP response object from the server.

##### Usage

```js
$auth.unlink('github')
  .then(function(response) {
    // You have unlinked a GitHub account.
  })
  .catch(function(response) {
    // Handle errors here.
  });
```

<hr>

#### `$auth.getToken()`

Returns a token from Local Storage (or Session Storage).

```js
$auth.getToken();
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMzQ1Njc4OTAsIm5hbWUiOiJKb2huIERvZSJ9.kRkUHzvZMWXjgB4zkO3d6P1imkdp0ogebLuxnTCiYUU
```

<hr>

#### `$auth.getPayload()`

Returns a JWT Claims Set, i.e. the middle part of a JSON Web Token.

##### Usage

```js
$auth.getPayload();
// { exp: 1414978281, iat: 1413765081, userId: "544457a3eb129ee822a38fdd" }
```

<hr>

#### `$auth.setToken(token)`

Saves a JWT or an access token to Local Storage / Session Storage.

##### Parameters

| Param                    | Type     | Details
| ------------------------ | -------- | ---------------------------------------------------------------------------------------
| **token**                | `Object` | An object that takes a JWT (`response.data[config.tokenName]`) or an access token (`response.access_token`).

<hr>

#### `$auth.removeToken()`

Removes a token from Local Storage / Session Storage. Used internally by [`$auth.logout()`](#authlogout).

##### Usage

```js
$auth.removeToken();
```

<hr>

#### `$auth.setStorageType(type)`

Sets storage type to Local Storage or Session Storage.

##### Parameters

| Param                    | Type     | Details
| ------------------------ | -------- | -------------------------------------------------------
| **type**                 | `String` | Accepts `'localStorage'` and `'sessionStorage'` values.

##### Usage

```js
$auth.setStorageType('sessionStorage');
```

## FAQ

#### How can I send a token in a format other than `Authorization: Bearer <token>`?
If you are unable to send a token to your server in the following format - `Authorization: Bearer <token>`, then use
**`$authProvider.authHeader`** and **`$authProvider.authToken`** config options to change the header format. The default values are `Authorization` and `Bearer`, respectively.

#### How can I avoid sending Authorization header on all HTTP requests?
- By default, once user is authenticated, JWT will be sent on every request. If you would like to prevent that, you could use `skipAuthorization` option in your `$http` request. For example:

```js
$http({
  method: 'GET',
  url: '/api/endpoint',
  skipAuthorization: true  // `Authorization: Bearer <token>` will not be sent on this request.
});
```

#### Is there a way to dynamically change `localStorage` to `sessionStorage`?
Yes, you can toggle between [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) and [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionstorage) via the following Satellizer methods:
- `$auth.setStorageType('sessionStorage');`
- `$auth.setStorageType('localStorage');`

## Credits

| Contribution               | User
| -------------------------- | --------------------------------------
| Dropwizard (Java) Example  | [Alice Chen](https://github.com/chena)
| Go Example                 | [Salim Alami](https://github.com/celrenheit)
| Ruby on Rails Example      | [Simonas Gildutis](https://github.com/simonasdev)
| Ionic Framework Example    | [Dimitris Bozelos](https://github.com/krystalcode)

Additionally, I would like to thank all other contributors who have reported
bugs, submitted pull requests and suggested new features!

## License

The MIT License (MIT)

Copyright (c) 2014-2015 Sahat Yalkabov

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
