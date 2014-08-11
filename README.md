![Project Logo](https://lh6.googleusercontent.com/-YmfKZZLZKL0/U-KVPFSbiOI/AAAAAAAAEZA/maoYT8iJCnA/w1089-h513-no/sshot-1.png)

# [Satellizer](https://github.com/sahat/satellizer/) 
[![Build Status](https://travis-ci.org/sahat/satellizer.svg?branch=master)](https://travis-ci.org/sahat/satellizer) 
[![Code Climate](https://codeclimate.com/github/sahat/satellizer/badges/gpa.svg)](https://codeclimate.com/github/sahat/satellizer) 
[![Test Coverage](https://codeclimate.com/github/sahat/satellizer/badges/coverage.svg)](https://codeclimate.com/github/sahat/satellizer)
[![Bower version](https://badge.fury.io/bo/satellizer.svg)](http://badge.fury.io/bo/satellizer)

**Live Demo:** [http://satellizer.herokuapp.com](http://satellizer.herokuapp.com)

**Satellizer** is a simple to use, end-to-end, token-based authentication module 
for [AngularJS](http://angularjs.org) with built-in support for Google, Facebook,
LinkedIn, Twitter authentication providers, plus Email and Password sign-in 
method. You are not limited to the sign-in options above, in fact you can add
any *OAuth 1.0* or *OAuth 2.0* provider by passing provider-specific information
during the configuration step.

![Screenshot](https://lh4.googleusercontent.com/-0UUIecT-3N4/U-LQJkd75iI/AAAAAAAAEZY/YN3Oe-eUPGc/w1676-h1158-no/satellizer.png)

## Installation

The easiest way to get **Satellizer** is by running one of the following 
commands:

```bash
# Bower
bower install satellizer --save

# NPM
npm install satellizer --save
```

**Note:** Alternatively, you may just manually grab `satellizer.js` or
`satellizer.min.js` from the [lib](https://github.com/sahat/satellizer/tree/master/lib)
directory.

## Usage

**app.js**
```js
angular.module('MyApp', ['Satellizer'])
  .config(function($authProvider) {
    
    $authProvider.setProvider({
      name: 'facebook',
      clientId: '624059410963642',
      url: '/auth/facebook'
    });
    
  });
```

**loginCtrl.js**
```js
angular.module('MyApp')
  .controller('LoginCtrl', function($scope, $auth) {
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider);
    };
  });
```

**login.html**
```html
<button ng-click="authenticate('facebook')">Sign in with Facebook</button>
```

For server-side usage please refer to the [examples](https://github.com/sahat/satellizer/tree/master/examples)
directory.

## Configuration

Below is a complete listing of all default configuration options.

```js
$authProvider.logoutRedirect = '/';
$authProvider.loginRedirect = '/';
$authProvider.loginUrl = '/auth/login';
$authProvider.signupUrl = '/auth/signup';
$authProvider.signupRedirect = '/login';
$authProvider.loginRoute = '/login';
$authProvider.signupRoute = '/signup';
$authProvider.user = 'currentUser';

// Google
$authProvider.setProvider({
  name: 'google',
  url: '/auth/google',
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
  redirectUri: window.location.origin,
  scope: 'openid profile email',
  requiredUrlParams: ['scope'],
  optionalUrlParams: ['display'],
  display: 'popup',
  type: 'oauth2',
  popupOptions: {
    width: 452,
    height: 633
  }
});

// Facebook
$authProvider.setProvider({
  name: 'facebook',
  url: '/auth/facebook',
  authorizationEndpoint: 'https://www.facebook.com/dialog/oauth',
  redirectUri: window.location.origin,
  scope: 'email',
  requiredUrlParams: ['display'],
  display: 'popup',
  type: 'oauth2',
  popupOptions: {
    width: 481,
    height: 269
  }
});

// LinkedIn
$authProvider.setProvider({
  name: 'linkedin',
  url: '/auth/linkedin',
  authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
  redirectUri: window.location.origin,
  requiredUrlParams: ['state'],
  state: 'STATE',
  type: 'oauth2'
});

// Twitter
$authProvider.setProvider({
  url: '/auth/twitter',
  authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
  type: 'oauth1'
});
  ```

## How It Works
**Satellizer** relies on *Token-Based Authentication* with
[JSON Web Tokens](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/) 
instead of cookies and sessions. Each sub-section below goes in-depth into
how the authentication process works.

### Login with OAuth 2.0

1. Opens popup window via `$auth.authenticate('provider_name')`.
2. *Sign in* with that provider by entering your username and password.
3. Popup is redirected back to your app, e.g. **http://localhost:3000**, with the `?code=` url parameter.
4. The code is sent back to the parent window and popup is immediately closed.
5. Parent window sends a `POST` request to **/auth/provider** with the authorization code from popup.
6. On the server, *authorization code* is exchanged for *access token*.
7. User information is retrived using the *access token* from **Step 6**.
8. Look up the user by the unique *provider id*. If user already exists, grab 
the existing user, otherwise create a new user account.
9. In both cases of Step 8 creates a *JSON Web Token* using user object as the
its *payload*.
10. Reply with JSON Web Token.
11. Back on the client, parse the token, extract user information from the
payload and save it to Local Storage for subsequent use after page reload.

### Login with OAuth 1.0

foo bar


### Login with Email and Password

foo bar

### Signup

foo bar

### Logout

foo bar

## Obtaining OAuth Keys

<img src="http://images.google.com/intl/en_ALL/images/srpr/logo6w.png" width="150">
- Visit [Google Cloud Console](https://cloud.google.com/console/project)
- Click **CREATE PROJECT** button
- Enter *Project Name*, then click **CREATE**
- Then select *APIs & auth* from the sidebar and click on *Credentials* tab
- Click **CREATE NEW CLIENT ID** button
 - **Application Type**: Web Application
 - **Authorized Javascript origins**: http://localhost:3000
 - **Authorized redirect URI**: http://localhost:3000

<hr>

<img src="http://www.doit.ba/img/facebook.jpg" width="150">
- Visit [Facebook Developers](https://developers.facebook.com/)
- Click **Apps > Create a New App** in the navigation bar
- Enter *Display Name*, then choose a category, then click **Create app**
- Click on *Settings* on the sidebar, then click **+ Add Platform**
- Select **Website**
- Enter `http://localhost:3000` for *Site URL*

<hr>

<img src="http://indonesia-royal.com/wp-content/uploads/2014/06/twitter-bird-square-logo.jpg" height="70">
- Sign in at [https://dev.twitter.com](https://dev.twitter.com/)
- From the profile picture dropdown menu select **My Applications**
- Click **Create a new application**
- Enter your application name, website and description
- For **Callback URL**: http://127.0.0.1:3000
- Go to **Settings** tab
- Under *Application Type* select **Read and Write** access
- Check the box **Allow this application to be used to Sign in with Twitter**
- Click **Update this Twitter's applications settings**

## API Reference

- [`$auth.login(user)`](#authlogin)
- [`$auth.signup(user)`](#authsignup)
- [`$auth.authenticate(name)`](#authauthenticate)
- [`$auth.logout()`](#authlogout)
- [`$auth.isAuthenticated()`](#authisauthenticated)

#### `$auth.login(user)`

Sign in via email and password where:
- `user` - object with *email* and *password* properties.

```js
$auth.login({
  email: $scope.email,
  password: $scope.password
});
```

#### `$auth.signup(user)`

Creates a new local account where: 
- `user` - object with *email*, *password* and *other* fields.

```js
$auth.signup({
  email: $scope.email,
  password: $scope.password
});
```

#### `$auth.authenticate(name)`

Starts the *OAuth 1.0* or *OAuth 2.0* authentication flow by opening a poup where:
- `name` - valid provider name.

If empty or invalid name is provided, the function will throw an error.

```js
$auth.authenticate('google').then(function() {
  // signed in!
});
```

#### `$auth.logout()`

Logs out current user by deleting the token from *Local Storage* and setting
`currentUser` to `null`. *No request to the server is necessary*.

```js
$auth.logout();
});
```

#### `$auth.isAuthenticated()`

Returns `true` or `false` if the user is signed in or not.

```js
$auth.isAuthenticated() // true
```

Alternatively, you may check if `currentUser` is defined to determine the 
authentication state.

```html
<ul class="nav navbar-nav pull-right" ng-if="!currentUser">
  <li><a href="/#/login">Login</a></li>
  <li><a href="/#/signup">Sign up</a></li>
</ul>
<ul class="nav navbar-nav pull-right" ng-if="currentUser">
  <li><a href="/#/logout">Logout</a></li>
</ul>
```

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