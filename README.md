![Project Logo](https://lh6.googleusercontent.com/-YmfKZZLZKL0/U-KVPFSbiOI/AAAAAAAAEZA/maoYT8iJCnA/w1089-h513-no/sshot-1.png)

# [Satellizer](https://github.com/sahat/satellizer/)

[![Join the chat at https://gitter.im/sahat/satellizer](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/sahat/satellizer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](http://img.shields.io/travis/sahat/satellizer.svg?style=flat)](https://travis-ci.org/sahat/satellizer)
[![Test Coverage](http://img.shields.io/codeclimate/coverage/github/sahat/satellizer.svg?style=flat)](https://codeclimate.com/github/sahat/satellizer)
[![Version](http://img.shields.io/badge/version-0.11.2-orange.svg?style=flat)](https://www.npmjs.org/package/satellizer)

**Live Demo:** [https://satellizer.herokuapp.com](https://satellizer.herokuapp.com)

---

**Satellizer** is a simple to use, end-to-end, token-based authentication module
for [AngularJS](http://angularjs.org) with built-in support for Google, Facebook,
LinkedIn, Twitter, Yahoo, Windows Live authentication providers, as well as Email and Password
sign-in. You are not limited to the sign-in options above, in fact you can add
any *OAuth 1.0* or *OAuth 2.0* provider by passing provider-specific information
during the configuration step.

![Screenshot](https://lh4.googleusercontent.com/-0UUIecT-3N4/U-LQJkd75iI/AAAAAAAAEZY/YN3Oe-eUPGc/w1676-h1158-no/satellizer.png)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Browser Support](#browser-support)
- [How It Works](#how-it-works)
- [Obtaining OAuth Keys](#obtaining-oauth-keys)
- [API Reference](#api-reference)
- [Contributing](#contributing)
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

**Note:** Alternatively, you may download the [latest release](https://github.com/sahat/satellizer/releases)
or use the CDN:

```html
<!--[if lte IE 9]>
    <script src="//cdnjs.cloudflare.com/ajax/libs/Base64/0.3.0/base64.min.js"></script>
<![endif]-->
<script src="//cdn.jsdelivr.net/satellizer/0.11.2/satellizer.min.js"></script>
```

**Note:** Sattelizer uses [window.btoa](https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/btoa) and [window.atob](https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/atob) for parsing JWT.  If you still have to support **IE9**, use the Base64 polyfill above.

## Usage

**Step 1. App Module**
```js
angular.module('MyApp', ['satellizer'])
  .config(function($authProvider) {

    $authProvider.facebook({
      clientId: '624059410963642'
    });

    $authProvider.google({
      clientId: '631036554609-v5hm2amv4pvico3asfi97f54sc51ji4o.apps.googleusercontent.com'
    });

    $authProvider.github({
      clientId: '0ba2600b1dbdb756688b'
    });

    $authProvider.linkedin({
      clientId: '77cw786yignpzj'
    });

    $authProvider.yahoo({
      clientId: 'dj0yJmk9dkNGM0RTOHpOM0ZsJmQ9WVdrOVlVTm9hVk0wTkRRbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0wMA--'
    });

    $authProvider.live({
      clientId: '000000004C12E68D'
    });

    $authProvider.twitter({
      url: '/auth/twitter'
    });

    $authProvider.oauth2({
      name: 'foursquare',
      url: '/auth/foursquare',
      redirectUri: window.location.origin,
      clientId: 'MTCEJ3NGW2PNNB31WOSBFDSAD4MTHYVAZ1UKIULXZ2CVFC2K',
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
<button ng-click="authenticate('twitter')">Sign in with Twitter</button>
<button ng-click="authenticate('foursquare')">Sign in with Foursquare</button>
<button ng-click="authenticate('yahoo')">Sign in with Yahoo</button>
<button ng-click="authenticate('live')">Sign in with Windows Live</button>
```

**Note:** For server-side usage please refer to the [examples](https://github.com/sahat/satellizer/tree/master/examples/server)
directory.

## Configuration

Below is a complete listing of all default configuration options.

```js
$authProvider.httpInterceptor = true; // Add Authorization header to HTTP request
$authProvider.loginOnSignup = true;
$authProvider.baseUrl = '/' // API Base URL for the paths below.
$authProvider.loginRedirect = '/';
$authProvider.logoutRedirect = '/';
$authProvider.signupRedirect = '/login';
$authProvider.loginUrl = '/auth/login';
$authProvider.signupUrl = '/auth/signup';
$authProvider.loginRoute = '/login';
$authProvider.signupRoute = '/signup';
$authProvider.tokenRoot = false; // set the token parent element if the token is not the JSON root
$authProvider.tokenName = 'token';
$authProvider.tokenPrefix = 'satellizer'; // Local Storage name prefix
$authProvider.unlinkUrl = '/auth/unlink/';
$authProvider.unlinkMethod = 'get';
$authProvider.authHeader = 'Authorization';
$authProvider.authToken = 'Bearer';
$authProvider.withCredentials = true;
$authProvider.platform = 'browser'; // or 'mobile'
$authProvider.storage = 'localStorage'; // or 'sessionStorage'

// Facebook
$authProvider.facebook({
  url: '/auth/facebook',
  authorizationEndpoint: 'https://www.facebook.com/v2.3/dialog/oauth',
  redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host + '/',
  scope: 'email',
  scopeDelimiter: ',',
  requiredUrlParams: ['display', 'scope'],
  display: 'popup',
  type: '2.0',
  popupOptions: { width: 481, height: 269 }
});

// Google
$authProvider.google({
  url: '/auth/google',
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
  redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
  scope: ['profile', 'email'];
  scopePrefix: 'openid';
  scopeDelimiter: ' ',
  requiredUrlParams: ['scope'],
  optionalUrlParams: ['display'],
  display: 'popup',
  type: '2.0',
  popupOptions: { width: 580, height: 400 }
});

// LinkedIn
$authProvider.linkedin({
  url: '/auth/linkedin',
  authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
  redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
  requiredUrlParams: ['state'],
  scope: [],
  scopeDelimiter: ' ',
  state: 'STATE',
  type: '2.0',
  popupOptions: { width: 527, height: 582 }
});

// Twitter
$authProvider.twitter({
  url: '/auth/twitter',
  type: '1.0',
  popupOptions: { width: 495, height: 645 }
});

// GitHub
$authProvider.github({
  url: '/auth/github',
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
  scope: [],
  scopeDelimiter: ' ',
  type: '2.0',
  popupOptions: { width: 1020, height: 618 }
});

// Windows Live
$authProvider.live({
  url: '/auth/live',
  authorizationEndpoint: 'https://login.live.com/oauth20_authorize.srf',
  redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
  scope: ['wl.basic'],
  scopeDelimiter: ' ',
  requiredUrlParams: ['display', 'scope'],
  display: 'popup',
  type: '2.0',
  popupOptions: { width: 500, height: 560 }
});

// Yahoo
$authProvider.yahoo({
  url: '/auth/yahoo',
  authorizationEndpoint: 'https://api.login.yahoo.com/oauth2/request_auth',
  redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
  scope: [],
  scopeDelimiter: ',',
  type: '2.0',
  popupOptions: { width: 559, height: 519 }
});

// OAuth 2.0
$authProvider.oauth2({
  url: null,
  name: null,
  scope: null,
  scopeDelimiter: null,
  clientId: null,
  redirectUri: null,
  popupOptions: null,
  authorizationEndpoint: null,
  responseParams: null,
  requiredUrlParams: null,
  optionalUrlParams: null,
  defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
  responseType: 'code'
});

// OAuth 1.0
$authProvider.oauth1({
  url: null,
  name: null,
  popupOptions: null
});
```

**Note:** If for some reason you are unable to send a token to
your server in the following format - `Authorization: Bearer <token>`, then use
`$authProvider.authHeader` method to override this behavior, e.g. set its value to
**x-access-token** or another custom header that your backend may require.

## Not sending the JWT for specific requests 
```
// This request will NOT send the token as it has skipAuthentication
$http({
  url: '/api/endpoint',
  skipAuthorization: true
  method: 'GET'
});
```

## Updating storage
To toggle from localStorage and sessionStorage run `$auth.setStorage('sessionStorage');` or `$auth.setStorage('localStorage');`

## Browser Support

<table>
  <tbody>
    <tr>
      <td><img src="http://ie.microsoft.com/testdrive/ieblog/2010/Sep/16_UserExperiencesEvolvingthebluee_23.png" height="40"></td>
      <td><img src="http://img3.wikia.nocookie.net/__cb20120330024137/logopedia/images/d/d7/Google_Chrome_logo_2011.svg" height="40"></td>
      <td><img src="http://media.idownloadblog.com/wp-content/uploads/2014/06/Safari-logo-OS-X-Yosemite.png" height="40"></td>
      <td><img src="http://th09.deviantart.net/fs71/200H/f/2013/185/e/b/firefox_2013_vector_icon_by_thegoldenbox-d6bxsye.png" height="40"></td>
      <td><img src="http://upload.wikimedia.org/wikipedia/commons/d/d4/Opera_browser_logo_2013.png" height="40"></td>

    </tr>
    <tr>
      <td align="center">9*</td>
      <td align="center">✓</td>
      <td align="center">✓</td>
      <td align="center">✓</td>
      <td align="center">✓</td>
    </tr>
  </tbody>
</table>

__*__ Requires [Base64.js](https://github.com/davidchambers/Base64.js/) polyfill.

## How It Works

**Satellizer** relies on *token-based authentication* using
[JSON Web Tokens](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/)
instead of cookies. Each **Wiki** link below goes in-depth into how the
authentication process works.

- [Login with OAuth 2.0](https://github.com/sahat/satellizer/wiki/Login-with-OAuth-2.0)
- [Login with OAuth 1.0](https://github.com/sahat/satellizer/wiki/Login-with-OAuth-1.0)
- [Login with Email and Password](https://github.com/sahat/satellizer/wiki/Login-with-Email-and-Password)
- [Signup](https://github.com/sahat/satellizer/wiki/Signup)
- [Logout](https://github.com/sahat/satellizer/wiki/Logout)

**Note:** To learn more about JSON Web Token (JWT) visit [JWT.io](http://jwt.io/).

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

<img src="http://indonesia-royal.com/wp-content/uploads/2014/06/twitter-bird-square-logo.jpg" height="70">
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
and specify `mylocalwebsite.net` as your *Redirect URL* on **API Settings** tab.


## API Reference

- [`$auth.login(user)`](#authloginuser)
- [`$auth.signup(user)`](#authsignupuser)
- [`$auth.authenticate(name, [userData])`](#authauthenticatename-userdata)
- [`$auth.logout([redirect])`](#authlogout-redirect)
- [`$auth.isAuthenticated()`](#authisauthenticated)
- [`$auth.link(provider, [userData])`](#authlinkprovider-userdata)
- [`$auth.unlink(provider)`](#authunlinkprovider)
- [`$auth.getToken()`](#authgettoken)
- [`$auth.getPayload()`](#authgetpayload)
- [`$auth.setToken(token, [redirect])`](#authsettokentoken-redirect)
- [`$auth.removeToken()`](#authremovetoken)

#### `$auth.login(user)`

Sign in via email and password where:
- **user** - Plain JavaScript object.

##### Returns

- **response** - The `$http` response object from the server.

```js
$auth.login({
  email: $scope.email,
  password: $scope.password
});
```

**Note:** This method returns a promise.

<hr>

#### `$auth.signup(user)`

Creates a local account with email and password. You can use whatever fields you want as long as
you implement them on the server.

- **user** - Plain JavaScript object.

#### Returns

- **response** - The `$http` response object from the server.

#### Usage

```js
$auth.signup({
  email: $scope.email,
  password: $scope.password
}).then(function(response) {
  console.log(response.data);
});
```

**Note:** This method returns a promise.

<hr>

#### `$auth.authenticate(name, [userData])`

Starts the *OAuth 1.0* or the *OAuth 2.0* authentication flow by opening a popup window:

- **provider** - One of the built-in provider names or a custom provider name created
via `$authProvider.oauth1()` or `$authProvider.oauth2()` methods.
- **userData** - Optional object for sending additional data to the server along with
`code`, `clientId`, `redirectUri` (OAuth 2.0) or `oauth_token`, `oauth_verifier` (OAuth 1.0).

#### Returns

- **response** - The `$http` response object from the server.

#### Usage

```js
$auth.authenticate('google').then(function(response) {
  // Signed In.
});
```

**Note:** This method returns a promise.

<hr>

#### `$auth.logout([redirect])`

Deletes a JWT from Local Storage.

- **redirect** - Optional URL string for redirecting after successful logout.

#### Usage

```js
$auth.logout();
```

**Note:** This method returns a promise.

<hr>

#### `$auth.isAuthenticated()`

Returns `true` if a JWT is present in Local Storage and it is not expired, otherwise returns `false`.

**Note:** This method expects the [exp](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html#expDef)
claim to check for the expiration time.

#### Usage

```js
// Controller
$scope.isAuthenticated = function() {
  return $auth.isAuthenticated();
};
```

```html
<!-- Template -->
<ul class="nav navbar-nav pull-right" ng-if="!isAuthenticated()">
  <li><a href="/#/login">Login</a></li>
  <li><a href="/#/signup">Sign up</a></li>
</ul>
<ul class="nav navbar-nav pull-right" ng-if="isAuthenticated()">
  <li><a href="/#/logout">Logout</a></li>
</ul>
```

<hr>

#### `$auth.link(provider, [userData])`

Links an OAuth provider with the signed-in account. It is practically the same as
[$auth.authenticate()](#authauthenticatename-userdata) with the exception that it does not
redirect to `$authProvider.loginRedirect` route path.

- **provider** - One of the built-in provider names or a custom provider name created
via `$authProvider.oauth1()` or `$authProvider.oauth2()` methods.
- **userData** - Optional object for sending additional data to the server along with
`code`, `clientId`, `redirectUri` (OAuth 2.0) or `oauth_token`, `oauth_verifier` (OAuth 1.0).

**Note:** Linking accounts business logic is handled entirely on the server.

#### Usage

```js
$auth.link('github');
```

**Note:** This method returns a promise.

<hr>

#### `$auth.unlink(provider)`

Unlinks an OAuth provider from the signed-in account. It sends a GET request to `/auth/unlink/:provider`.

- **provider** - One of the built-in provider names or a custom provider name created
via `$authProvider.oauth1()` or `$authProvider.oauth2()` methods.

**Note:** You can override the default *unlink path* above via `$authProvider.unlinkUrl` configuration property.

**Note:** It uses `GET` method by default, but can be changed via `$authProvider.unlinkMethod = 'post'`. If you are going
to use `POST`, **provider** obviously should be an object, not a string.

#### Usage

```js
$auth.unlink('github');
```

**Note:** This method returns a promise.

<hr>

#### `$auth.getToken()`

Returns a JWT from Local Storage.

#### Usage

```js
$auth.getToken();
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMzQ1Njc4OTAsIm5hbWUiOiJKb2huIERvZSJ9.kRkUHzvZMWXjgB4zkO3d6P1imkdp0ogebLuxnTCiYUU
```

<hr>

#### `$auth.getPayload()`

Returns a JWT Claims Set, i.e. the middle part of a JSON Web Token.

#### Usage

```js
$auth.getPayload();
// { exp: 1414978281, iat: 1413765081, sub: "544457a3eb129ee822a38fdd" }
```

<hr>

#### `$auth.setToken(token, [redirect])`

Saves a JWT or an access token to Local Storage. *It uses `shared.setToken` internally.*

- **token** - An object that takes a JWT (`response.data[config.tokenName]`) or an access token (`response.access_token`).
- **redirect** - An optional boolean value that controls whether or not to redirect to `loginRedirect` route after saving a token. Defaults to `false`.

<hr>

#### `$auth.removeToken()`

Removes a JWT from Local Storage.


## TODO

- [ ] C# (ASP.NET 5) implementation
- [x] Go implementation
- [x] Java (Dropwizard) implementation
- [x] Node.js (Express) implementation
- [x] PHP (Laravel) implementation
- [x] Python (Flask) implementation
- [x] Ruby (Ruby on Rails) implementation

## Contributing

Found a typo or a bug? Send a pull request. I would especially appreciate pull
requests for server-side examples since I do not have much experience with any
of the languages on the *TODO* list.

## Credits

A big thanks goes to [Alice Chen](https://github.com/chena) for all your hard work
on the [Dropwizard](https://dropwizard.github.io) implementation and
[Jesús Rodríguez](https://github.com/Foxandxss) for being so proactive and actively
reporting bugs.

Additionally, I would like to thank all other contributors who have submitted
issues and/or pull requests!

Satellizer was inspired by [ng-token-auth](https://github.com/lynndylanhurley/ng-token-auth)
and [torii](https://github.com/Vestorly/torii) and [angular-oauth](https://github.com/enginous/angular-oauth).

## License

The MIT License (MIT)

Copyright (c) 2015 Sahat Yalkabov

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
