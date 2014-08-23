
![Project Logo](https://lh6.googleusercontent.com/-YmfKZZLZKL0/U-KVPFSbiOI/AAAAAAAAEZA/maoYT8iJCnA/w1089-h513-no/sshot-1.png)

# [Satellizer](https://github.com/sahat/satellizer/) 
[![Build Status](http://img.shields.io/travis/sahat/satellizer.svg?style=flat)](https://travis-ci.org/sahat/satellizer) 
[![Code Climate](http://img.shields.io/codeclimate/github/sahat/satellizer.svg?style=flat)](https://codeclimate.com/github/sahat/satellizer) 
[![Test Coverage](http://img.shields.io/codeclimate/coverage/github/sahat/satellizer.svg?style=flat)](https://codeclimate.com/github/sahat/satellizer)
[![Version](http://img.shields.io/badge/version-0.4.1-orange.svg?style=flat)](https://www.npmjs.org/package/satellizer)

**:clapper: Live Demo:** [http://satellizer.herokuapp.com](http://satellizer.herokuapp.com)

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

**Note:** Alternatively, you may download the [latest release](https://github.com/sahat/satellizer/releases)
from this repository.

## Usage

**Step 1. App Module**
```js
angular.module('MyApp', ['Satellizer'])
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
      redirectUri: window.location.origin
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

For server-side usage please refer to the [examples](https://github.com/sahat/satellizer/tree/master/examples/server)
directory.

**Note:** List of popular [OAuth service providers](http://en.wikipedia.org/wiki/OAuth#List_of_OAuth_service_providers).

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
$authProvider.tokenName = 'satellizerToken';
$authProvider.unlinkUrl: '/auth/unlink/'

// Google
$authProvider.google({
  url: '/auth/google',
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
  redirectUri: window.location.origin,
  scope: 'openid profile email',
  scopeDelimiter: ' ',
  requiredUrlParams: ['scope'],
  optionalUrlParams: ['display'],
  display: 'popup',
  type: '2.0',
  popupOptions: {
    width: 452,
    height: 633
  }
});

// GitHub
$authProvider.github({
  name: 'github',
  url: '/auth/github',
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  redirectUri: window.location.origin,
  scope: [],
  scopeDelimiter: ' ',
  type: '2.0',
  popupOptions: {
    width: 1020,
    height: 618
  }
});

// Facebook
$authProvider.facebook({
  url: '/auth/facebook',
  authorizationEndpoint: 'https://www.facebook.com/dialog/oauth',
  redirectUri: window.location.origin + '/',
  scope: 'email',
  scopeDelimiter: ',',
  requiredUrlParams: ['display'],
  display: 'popup',
  type: '2.0',
  popupOptions: {
    width: 481,
    height: 269
  }
});

// LinkedIn
$authProvider.linkedin({
  url: '/auth/linkedin',
  authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
  redirectUri: window.location.origin,
  requiredUrlParams: ['state'],
  scope: [],
  scopeDelimiter: ' ',
  state: 'STATE',
  type: '2.0',
  popupOptions: {
    width: 527,
    height: 582
  }
});

// Twitter
$authProvider.twitter({
  url: '/auth/twitter',
  type: '1.0'
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

## How It Works
**Satellizer** relies on *Token-Based Authentication* with
[JSON Web Tokens](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/) 
instead of cookies and sessions. Each sub-section below goes in-depth into
how the authentication process works.

### Login with OAuth 2.0

1. **Client:** Open a popup window via `$auth.authenticate('provider_name')`.
2. **Client:** Sign in with that provider by entering your username and password and authorize the application.
3. **Client:** Popup is redirected back to your app, e.g. **http://localhost:3000**, 
with the `code` url parameter.
4. **Client:** The `code` (authorization code) is sent back to the parent window
and popup is immediately closed.
5. **Client:** Parent window sends a `POST` request to **/auth/provider** with the 
authorization code from popup.
6. **Server:** Then *authorization code* is exchanged for *access token*.
7. **Server:** User information is retrived using the *access token* from **Step 6**.
8. **Server:** Look up the user by the unique *provider id*. If user already exists, grab 
the existing user, otherwise create a new user account.
9. **Server:** In both cases of Step 8 creates a *JSON Web Token* using user object as the
its *payload*.
10. **Server:** Reply with JSON Web Token.
11. **Client:** Parse the token, extract user information from the
payload and save it to Local Storage for subsequent use after page reload.

### Login with OAuth 1.0

1. **Client:** Open a popup window via `$auth.authenticate('provider_name')`.
2. **Client:** Unlike OAuth 2.0 you cannot go directly to the authentication screen without
a valid request token.
3. **Client:** The OAuth 1.0 flow starts with the `GET` request to `/auth/<provider>` inside a popup.  
4. **Server:** Check if URL contains `oauth_token` and `oauth_verifier` parameters.
5. **Sever:** No. Send an OAuth signed `POST` request to `/request_token` URL.
6. **Server:** Redirect to `/authenticate` URL with a valid *request token*.
7. **Client:** Sign in with your username and password and authorize the application.
8. **Client:** Send a *GET* request back to `/auth/<provider>` with `oauth_token` and `oauth_verifier` parameters.
9. **Server:** Repeat **Step 4**.
10. **Server:** Yes. Send an OAuth signed `POST` request to `/access_token` URL.
11. **Server:** Look up the user by the unique *provider id*. If user already exists, grab 
the existing user, otherwise create a new user account.
12. **Server:** Reply with JSON Web Token.
13. **Client:** Parse the token, extract user information from the
payload and save it to Local Storage for subsequent use after page reload.

### Login with Email and Password

1. **Client:** Enter your email and password into the login form.
2. **Client:** On form submit call `$auth.login()` with email and password.
3. **Client:** Send a `POST` request to `/auth/login`.
4. **Server:** Check if email exists, if not return `401`.
5. **Server:** Check if password is correct, if not return `401`.
5. **Server:** Reply with JSON Web Token.
13. **Client:** Parse the token, extract user information from the
payload and save it to Local Storage for subsequent use after page reload.

### Signup

1. **Client:** Enter your email and password into the signup form.
2. **Client:** On form submit call `$auth.signup()` with email and password.
3. **Client:** Send a `POST` request to `/auth/signup`.
4. **Server:** Create a new user account then return `200 OK`.
5. **Client:** Redirect to `signupRedirect`. (Default: '/login')

### Logout

1. **Client:** Delete `currentUser` from the `$rootScope`.
2. **Client:** Delete `jwtToken` from the Local Storage.
3. **Client:** Redirect to `logoutRedirect`. (Default: `/`)

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
- [`$auth.link(provider)`](#authlinkprovider)
- [`$auth.unlink(provider)`](#authunlinkprovider)
- [`$auth.updateToken(token)`](#authupdatetokentoken)

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
- `user` - object with *email*, *password* fields.

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
```

#### `$auth.isAuthenticated()`

Returns `true` or `false` if the user is signed in or not.

```js
$auth.isAuthenticated(); // true
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

#### `$auth.link(provider)`

Links an OAuth provider to the account. *It's an alias for the `$auth.authenticate(provider)`*.


```js
$auth.unlink('github');
```

#### `$auth.unlink(provider)`

Unlinks an OAuth provider from the account.

```js
$auth.unlink('github');
```

#### `$auth.updateToken(token)`

Updates existing *JSON Web Token* stored in Local Storage with the new one.

```js
// Update user information
$http.put('/api/me', profileData).then(function(response) {
  $auth.updateToken(response.data.token);
});
```

## TODO

- [ ] C# (ASP.NET vNext) implementation
- [ ] Elixir (Phoenix) implementation
- [ ] Ruby (Sinatra) implementation
- [ ] Go (Martini) implementation
- [ ] Java (Dropwizard) implementation
- [ ] Scala (Play!) implementation
- [ ] PHP (Laravel) implementation
- [x] Python (Flask) implementation

## Contributing

Found a typo or a bug? Send a pull request. I would especially appreciate pull
requests for server-side examples since I do not have much experience with any
of the languages on the *TODO* list.

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













