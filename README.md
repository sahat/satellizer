![Project Logo](http://i.imgur.com/yutNy7x.jpg)

# [Satellizer](https://github.com/sahat/satellizer/)

[![Donate](https://img.shields.io/badge/paypal-donate-blue.svg)](https://paypal.me/sahat)
[![Join the chat at https://gitter.im/sahat/satellizer](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/sahat/satellizer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](http://img.shields.io/travis/sahat/satellizer.svg?style=flat)](https://travis-ci.org/sahat/satellizer)
[![npm version](https://badge.fury.io/js/satellizer.svg)](https://badge.fury.io/js/satellizer)
[![Book session on Codementor](https://cdn.codementor.io/badges/book_session_github.svg)](https://www.codementor.io/sahatyalkabov?utm_source=github&utm_medium=button&utm_term=sahatyalkabov&utm_campaign=github)
[![OpenCollective](https://opencollective.com/satellizer/backers/badge.svg)](#backers) 
[![OpenCollective](https://opencollective.com/satellizer/sponsors/badge.svg)](#sponsors)

[**Live Demo**](https://satellizer-sahat.rhcloud.com)

---

**Satellizer** is a simple to use, end-to-end, token-based authentication module
for [AngularJS](http://angularjs.org) with built-in support for Google, Facebook,
LinkedIn, Twitter, Instagram, GitHub, Bitbucket, Yahoo, Twitch, Microsoft (Windows Live) OAuth providers, as well as Email
and Password sign-in. However, you are not limited to the sign-in options above, in fact
you can add any *OAuth 1.0* or *OAuth 2.0* provider by passing provider-specific information
in the app *config* block.

![Screenshot](https://lh4.googleusercontent.com/-0UUIecT-3N4/U-LQJkd75iI/AAAAAAAAEZY/YN3Oe-eUPGc/w1676-h1158-no/satellizer.png)

## Table of Contents

- [Installation](#installation)
 - [Requirements for Mobile Apps](#requirements-for-mobile-apps)
- [Usage](#usage)
- [Configuration](#configuration)
- [Browser Support](#browser-support)
- [Authentication Flow](#authentication-flow)
 - [Login with Email and Password](#-login-with-email-and-password)
 - [Login with OAuth 1.0](#-login-with-oauth-10)
 - [Login with OAuth 2.0](#-login-with-oauth-20)
 - [Logout](#-log-out)
- [Obtaining OAuth Keys](#obtaining-oauth-keys)
- [API Reference](#api-reference)
- [FAQ](#faq)
- [Community Resources](#community-resources)
- [Backers](#backers)
- [Sponsors](#sponsors)
- [Credits](#credits)
- [License](#license)

## Installation

#### <img src="https://upload.wikimedia.org/wikipedia/commons/e/e2/Google_Chrome_icon_%282011%29.svg" height="22" align="top"> Browser

```html
<script src="angular.js"></script>
<script src="satellizer.js"></script>
```
```html
<!-- Satellizer CDN -->
<script src="https://cdn.jsdelivr.net/satellizer/0.15.4/satellizer.min.js"></script>
```

#### <img src="https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg" height="22" align="top"> NPM

```
$ npm install satellizer
```

#### <img src="https://bower.io/img/bower-logo.svg" height="22" align="top"> Bower

```
$ bower install satellizer
```

### Requirements for Mobile Apps

With any Cordova mobile apps or any framework that uses Cordova, such as [Ionic Framework](http://ionicframework.com/), you will need to add [cordova-plugin-inappbrowser](https://cordova.apache.org/docs/en/3.0.0/cordova/inappbrowser/inappbrowser.html) plugin:

```
$ cordova plugin add cordova-plugin-inappbrowser
```

Make sure that **inAppBrowser** is listed in your project:

```
$ cordova plugins
cordova-plugin-console 1.0.2 "Console"
cordova-plugin-device 1.1.1 "Device"
cordova-plugin-inappbrowser 1.3.0 "InAppBrowser"
cordova-plugin-splashscreen 3.2.0 "Splashscreen"
cordova-plugin-statusbar 2.1.1 "StatusBar"
cordova-plugin-whitelist 1.2.1 "Whitelist"
ionic-plugin-keyboard 1.0.8 "Keyboard"
```

## Usage

**Step 1. App Module**
```js
angular.module('MyApp', ['satellizer'])
  .config(function($authProvider) {

    $authProvider.facebook({
      clientId: 'Facebook App ID'
    });

    // Optional: For client-side use (Implicit Grant), set responseType to 'token' (default: 'code')
    $authProvider.facebook({
      clientId: 'Facebook App ID',
      responseType: 'token'
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

    $authProvider.bitbucket({
      clientId: 'Bitbucket Client ID'
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
<button ng-click="authenticate('bitbucket')">Sign in with Bitbucket</button>
```

**Note:** For server-side usage please refer to the [**examples**](https://github.com/sahat/satellizer/tree/master/examples/server)
directory.

## Configuration

Below is a complete listing of all default configuration options.

```js
$authProvider.httpInterceptor = function() { return true; },
$authProvider.withCredentials = true;
$authProvider.tokenRoot = null;
$authProvider.baseUrl = '/';
$authProvider.loginUrl = '/auth/login';
$authProvider.signupUrl = '/auth/signup';
$authProvider.unlinkUrl = '/auth/unlink/';
$authProvider.tokenName = 'token';
$authProvider.tokenPrefix = 'satellizer';
$authProvider.tokenHeader = 'Authorization';
$authProvider.tokenType = 'Bearer';
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

// Bitbucket
$authProvider.bitbucket({
  url: '/auth/bitbucket',
  authorizationEndpoint: 'https://bitbucket.org/site/oauth2/authorize',
  redirectUri: window.location.origin + '/',
  optionalUrlParams: ['scope'],
  scope: ['email'],
  scopeDelimiter: ' ',
  type: '2.0',
  popupOptions: { width: 1020, height: 618 }
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
  authorizationEndpoint: null,
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
      <td align="center">9+</td>
      <td align="center">✓</td>
      <td align="center">✓</td>
      <td align="center">✓</td>
      <td align="center">✓</td>
      <td align="center">✓</td>
    </tr>
  </tbody>
</table>

## Authentication Flow

Satellizer relies on *token-based authentication* using
[JSON Web Tokens](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/)
instead of cookies.

Additionally, **authorization** (obtaining user's information with their permission) and **authentication** (application sign-in) requires sever-side implementation. See provided [examples](https://github.com/sahat/satellizer/tree/master/examples/server) implemented in multiple languages for your convenience. In other words, you cannot just launch your AngularJS application and expect everything to work. The only exception is when you use *OAuth 2.0 Implicit Grant* (client-side) authorization by setting `responseType: 'token'` in provider's [configuration](https://github.com/sahat/satellizer#configuration).

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

### <img height="34" align="top" src="http://i.imgur.com/S5Ei6Rj.png"> Log out
1. <img height="24" align="top" src="https://i.ytimg.com/i/bn1OgGei-DV7aSRo_HaAiw/mq1.jpg?v=4f8f2cc9"> **Client:** Remove token from Local Storage.

**Note:** To learn more about JSON Web Tokens visit <img src="http://jwt.io/img/pic_logo.svg" height="22" align="top"> [JWT.io](http://jwt.io/).

## Obtaining OAuth Keys

<img src="https://camo.githubusercontent.com/204e6b07369021b5b9eb7d228d051aca72a457ef/68747470733a2f2f75706c6f61642e77696b696d656469612e6f72672f77696b6970656469612f636f6d6d6f6e732f7468756d622f322f32662f476f6f676c655f323031355f6c6f676f2e7376672f3130303070782d476f6f676c655f323031355f6c6f676f2e7376672e706e67" width="150">
- Visit [Google Developer Console](https://console.developers.google.com/iam-admin/projects)
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

<img src="https://camo.githubusercontent.com/7318ebef474f99229892e6bf052f0117ca86f0e4/68747470733a2f2f6769746875622e676c6f62616c2e73736c2e666173746c792e6e65742f696d616765732f6d6f64756c65732f6c6f676f735f706167652f4769744875622d4c6f676f2e706e67" width="150">
- Visit [https://github.com/settings/profile](https://github.com/settings/profile)
- Select **Applications** in the left panel
- Go to **Developer applications** tab, then click on the **Register new application** button
 - **Application name**: Your app name
 - **Homepage URL**: *http://localhost:3000*
 - **Authorization callback URL**: *http://localhost:3000*
- Click on the **Register application** button

<hr>

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

Starts the OAuth 1.0 or the OAuth 2.0 authorization flow by opening a popup window. If used client side, [`responseType: "token"`](#authentication-flow) is required in the provider setup to get the actual access token. 

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

#### :question: Can I change `redirectUri` to something other than base URL?

By default, `redirectUri` is set to `window.location.origin` (protocol, hostname, port number of a URL) for all OAuth providers. This `redirectUri` must match *exactly* the URL¹ specified in your OAuth app settings.

**Facebook (example)**
![](http://i.imgur.com/eaykgcZ.png)


However, you can set `redirectUri` to any URL *path* you desire. For instance, you may follow the naming convention of [Passport.js](http://passportjs.org/):
```js
// Note: Must be absolute path.
window.location.origin + '/auth/facebook/facebook/callback'
window.location.origin + '/auth/facebook/google/callback'
...
```

Using the example above, a popup window will be redirected to `http://localhost:3000/auth/facebook/callback?code=YOUR_AUTHORIZATION_CODE` after a successful Facebook authorization. To avoid potential 404 errors, create server routes for each `redirectUri` URL that return **200 OK**. Or alternatively, you may render a custom template with a loading spinner. For the moment, a popup will not stay long enough to see that custom template, due to 20ms interval polling, but in the future I may add support for overriding this polling interval value.

As far as Satellizer is concerned, it does not matter what is the value of `redirectUri` as long as it matches URL in your OAuth app settings. Satellizer's primary concern is to read URL query/hash parameters, then close a popup.

¹ **Note:** Depending on the OAuth provider, it may be called *Site URL*, *Callback URL*, *Redirect URL*, and so on.

#### :question: How can I send a token in a format other than `Authorization: Bearer <token>`?
If you are unable to send a token to your server in the following format - `Authorization: Bearer <token>`, then use
**`$authProvider.tokenHeader`** and **`$authProvider.tokenType`** config options to change the header format. The default values are `Authorization` and `Bearer`, respectively.

For example, if you need to use `Authorization: Basic` header, this is where you change it.

#### :question: How can I avoid sending Authorization header on all HTTP requests?
By default, once user is authenticated, JWT will be sent on every request. If you would like to prevent that, you could use `skipAuthorization` option in your `$http` request. For example:

```js
$http({
  method: 'GET',
  url: '/api/endpoint',
  skipAuthorization: true  // `Authorization: Bearer <token>` will not be sent on this request.
});
```

#### :question: Is there a way to dynamically change `localStorage` to `sessionStorage`?
Yes, you can toggle between [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) and [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionstorage) via the following Satellizer methods:
- `$auth.setStorageType('sessionStorage');`
- `$auth.setStorageType('localStorage');`

#### :question: I am having a problem with Ionic authentication on iOS 9.
First, check what kind of error you are getting by opening the Web Inspector from **Develop > Simulator > index.html** menu.
If you have configured everything correctly, chances are you running into the following error:

> Failed to load resource: The resource could not be loaded because the App Transport Security policy requires the use of a secure connection.

Follow instructions on this [StackOverflow post](http://stackoverflow.com/questions/32631184/the-resource-could-not-be-loaded-because-the-app-transport-security-policy-requi) by adding `NSAppTransportSecurity` to *info.plist*. That should fix the problem.

## Community Resources

### Tutorials
- Ionic JWT auth with Facebook using Node.js ([Part 1](http://blog.grossman.io/ionic-jwt-auth-with-facebook-using-nodejs-part-1/) and [Part 2](http://blog.grossman.io/ionic-jwt-auth-with-facebook-using-nodejs-part-2-2/))
- [Build an Instagram clone with AngularJS, Satellizer, Node.js and MongoDB](https://hackhands.com/building-instagram-clone-angularjs-satellizer-nodejs-mongodb/)


## Credits

| Contribution               | User
| -------------------------- | --------------------------------------
| Dropwizard (Java) Example  | [Alice Chen](https://github.com/chena)
| Go Example                 | [Salim Alami](https://github.com/celrenheit)
| Ruby on Rails Example      | [Simonas Gildutis](https://github.com/simonasdev)
| Ionic Framework Example    | [Dimitris Bozelos](https://github.com/krystalcode)

Additionally, I would like to thank all other contributors who have reported
bugs, submitted pull requests and suggested new features!



## Backers
Support us with a monthly donation and help us continue our activities. [[Become a backer](https://opencollective.com/satellizer#backer)]

<a href="https://opencollective.com/satellizer/backer/0/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/1/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/2/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/3/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/4/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/5/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/6/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/7/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/8/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/9/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/10/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/10/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/11/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/11/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/12/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/12/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/13/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/13/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/14/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/14/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/15/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/15/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/16/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/16/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/17/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/17/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/18/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/18/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/19/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/19/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/20/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/20/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/21/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/21/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/22/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/22/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/23/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/23/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/24/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/24/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/25/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/25/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/26/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/26/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/27/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/27/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/28/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/28/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/backer/29/website" target="_blank"><img src="https://opencollective.com/satellizer/backer/29/avatar.svg"></a>

## Sponsors
Become a sponsor and get your logo on our README on Github with a link to your site. [[Become a sponsor](https://opencollective.com/satellizer#sponsor)]

<a href="https://opencollective.com/satellizer/sponsor/0/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/1/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/2/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/3/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/4/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/5/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/6/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/7/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/8/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/9/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/9/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/10/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/10/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/11/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/11/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/12/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/12/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/13/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/13/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/14/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/14/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/15/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/15/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/16/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/16/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/17/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/17/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/18/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/18/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/19/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/19/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/20/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/20/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/21/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/21/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/22/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/22/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/23/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/23/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/24/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/24/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/25/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/25/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/26/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/26/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/27/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/27/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/28/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/28/avatar.svg"></a>
<a href="https://opencollective.com/satellizer/sponsor/29/website" target="_blank"><img src="https://opencollective.com/satellizer/sponsor/29/avatar.svg"></a>

## License

The MIT License (MIT)

Copyright (c) 2016 Sahat Yalkabov

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
