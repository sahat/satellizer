![Project Logo](https://lh6.googleusercontent.com/-YmfKZZLZKL0/U-KVPFSbiOI/AAAAAAAAEZA/maoYT8iJCnA/w1089-h513-no/sshot-1.png)

# [Satellizer](https://github.com/sahat/satellizer/) 
[![Build Status](http://img.shields.io/travis/sahat/satellizer.svg?style=flat)](https://travis-ci.org/sahat/satellizer) 
[![Code Climate](http://img.shields.io/codeclimate/github/sahat/satellizer.svg?style=flat)](https://codeclimate.com/github/sahat/satellizer) 
[![Test Coverage](http://img.shields.io/codeclimate/coverage/github/sahat/satellizer.svg?style=flat)](https://codeclimate.com/github/sahat/satellizer)
[![Version](http://img.shields.io/badge/version-0.7.0-orange.svg?style=flat)](https://www.npmjs.org/package/satellizer)

**:space_invader: Live Demo:** [https://satellizer.herokuapp.com](https://satellizer.herokuapp.com)

**Satellizer** is a simple to use, end-to-end, token-based authentication module 
for [AngularJS](http://angularjs.org) with built-in support for Google, Facebook,
LinkedIn, Twitter authentication providers, plus Email and Password sign-in 
method. You are not limited to the sign-in options above, in fact you can add
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
bower install satellizer --save

# NPM
npm install satellizer --save
```

**Note:** Alternatively, you may download the [latest release](https://github.com/sahat/satellizer/releases)
or use the CDN:

```html
<script src="//cdn.jsdelivr.net/satellizer/0.7.0/satellizer.min.js"></script>
```

## Usage

**Step 1. App Module**
```js
angular.module('MyApp', ['satellizer'])
  .config(function($authProvider) {
    
    $authProvider.facebook({
      clientId: '624059410963642',
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
```

**:exclamation: Note:** For server-side usage please refer to the [examples](https://github.com/sahat/satellizer/tree/master/examples/server)
directory.

## Configuration

Below is a complete listing of all default configuration options.

```js
$authProvider.loginOnSignup = true;
$authProvider.loginRedirect = '/';
$authProvider.logoutRedirect = '/';
$authProvider.signupRedirect = '/login';
$authProvider.loginUrl = '/auth/login';
$authProvider.signupUrl = '/auth/signup';
$authProvider.loginRoute = '/login';
$authProvider.signupRoute = '/signup';
$authProvider.tokenName = 'token';
$authProvider.tokenPrefix = 'satellizer'; // Local storage name prefix
$authProvider.unlinkUrl = '/auth/unlink/';

// Facebook
$authProvider.facebook({
  url: '/auth/facebook',
  authorizationEndpoint: 'https://www.facebook.com/dialog/oauth',
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
  popupOptions: { width: 452, height: 633 }
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
  name: 'github',
  url: '/auth/github',
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
  scope: [],
  scopeDelimiter: ' ',
  type: '2.0',
  popupOptions: { width: 1020, height: 618 }
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
      <td align="center">8+</td>
      <td align="center">✓</td>
      <td align="center">✓</td>
      <td align="center">✓</td>
      <td align="center">✓</td>
    </tr>
  </tbody>
</table>

**:exclamation: Note:** If you stumble upon a browser version that does not work with *Satellizer* please [open an issue](https://github.com/sahat/satellizer/issues) so I could update the checkmark with the lowest supported version.


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

**:bulb: Note:** To learn more about JSON Web Token (JWT) visit [JWT.io](http://jwt.io/).

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

**:exclamation: Note:** Make sure you have turned on **Contacts API** and 
**Google+ API** in the *APIs* tab.

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
- Sign in at [https://dev.twitter.com](https://dev.twitter.com/)
- From the profile picture dropdown menu select **My Applications**
- Click **Create a new application**
- Enter your application name, website and description
- For **Callback URL**: *http://127.0.0.1:3000*
- Go to **Settings** tab
- Under *Application Type* select **Read and Write** access
- Check the box **Allow this application to be used to Sign in with Twitter**
- Click **Update this Twitter's applications settings**

## API Reference

- [`$auth.login(user)`](#authlogin)
- [`$auth.signup(user)`](#authsignup)
- [`$auth.authenticate(name, [userData])`](#authauthenticatename-userdata)
- [`$auth.logout()`](#authlogout)
- [`$auth.isAuthenticated()`](#authisauthenticated)
- [`$auth.link(provider)`](#authlinkprovider)
- [`$auth.unlink(provider)`](#authunlinkprovider)

#### `$auth.login(user)`

Sign in via email and password where:
- **user** - data object with *email* and *password* properties.

```js
$auth.login({
  email: $scope.email,
  password: $scope.password
});
```

#### `$auth.signup(user)`

Creates a new local account where: 
- **user** - data object with *email* and *password* properties.

```js
$auth.signup({
  email: $scope.email,
  password: $scope.password
});
```

#### `$auth.authenticate(name, [userData])`

Starts the *OAuth 1.0* or *OAuth 2.0* authentication flow by opening a popup where:
- **name** - one of the predefined provider names or a custom provider name created
via `$authProvider.oauth1()` or `$authProvider.oauth2()`.
- **userData** - optional object if you need to send some additional data to
the server along with `code`, `clientId` and `redirectUri` in the case of
*OAuth 2.0* or `oauth_token` and `oauth_verifier` in the case of *OAuth 1.0*.

```js
$auth.authenticate('google').then(function() {
  // Signed In.
});
```

#### `$auth.logout()`

Logs out current user by deleting the token from *Local Storage*.

```js
$auth.logout();
```

#### `$auth.isAuthenticated()`

Returns `true` or `false` depending on if the user is signed in or not.

*Controller:*
```js
$scope.isAuthenticated = function() {
  return $auth.isAuthenticated();
};
```

*Template:*
```html
<ul class="nav navbar-nav pull-right" ng-if="!isAuthenticated()">
  <li><a href="/#/login">Login</a></li>
  <li><a href="/#/signup">Sign up</a></li>
</ul>
<ul class="nav navbar-nav pull-right" ng-if="isAuthenticated()">
  <li><a href="/#/logout">Logout</a></li>
</ul>
```

#### `$auth.link(provider)`

Links an OAuth provider to the account. *Alias for `$auth.authenticate(provider)`*.

Account linking business logic is handled entirely on the server.

```js
$auth.link('github');
```

#### `$auth.unlink(provider)`

Unlinks an OAuth provider from the account by sending a **GET** request to the
**/auth/unlink/<provider>** URL.

```js
$auth.unlink('github');
```

## TODO

- [ ] C# (ASP.NET vNext) implementation
- [ ] Elixir (Phoenix) implementation
- [ ] Go (Beego) implementation
- [x] Java (Dropwizard) implementation
- [x] Node.js (Express) implementation
- [x] PHP (Laravel) implementation
- [x] Python (Flask) implementation
- [ ] Ruby (Sinatra and/or Rails) implementation
- [ ] Scala (Play!) implementation

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

Copyright (c) 2014 Sahat Yalkabov

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
