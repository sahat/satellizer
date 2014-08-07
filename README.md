![Project Logo](https://lh6.googleusercontent.com/-YmfKZZLZKL0/U-KVPFSbiOI/AAAAAAAAEZA/maoYT8iJCnA/w1089-h513-no/sshot-1.png)

# [Satellizer](https://github.com/sahat/satellizer/) 
[![Build Status](https://travis-ci.org/sahat/satellizer.svg?branch=master)](https://travis-ci.org/sahat/satellizer) 
[![Code Climate](http://img.shields.io/codeclimate/github/sahat/satellizer.svg)](https://codeclimate.com/github/sahat/satellizer) 
[![Coverage](http://img.shields.io/codeclimate/coverage/github/satellizer/satellizer.svg)](https://codeclimate.com/github/sahat/satellizer)
[![GitHub Tag](http://img.shields.io/github/tag/sahat/satellizer.svg)](https://github.com/sahat/satellizer/tags)

**:octocat: Demo:** [http://satellizer.herokuapp.com](http://satellizer.herokuapp.com)

**Satellizer** is a simple to use, end-to-end, token-based authentication module for [AngularJS](http://angularjs.org) with built-in support for Google, Facebook, LinkedIn, Twitter and Email & Password sign-in methods. You are not limited to the sign-in options above, in fact you can add any *OAuth 1.0* or *OAuth 2.0* provider by passing provider-specific information during the configuration step.

![Screenshot](https://lh4.googleusercontent.com/-0UUIecT-3N4/U-LQJkd75iI/AAAAAAAAEZY/YN3Oe-eUPGc/w1676-h1158-no/satellizer.png)

## Getting Started

Install via  **Bower:**

```bash
bower install satellizer --save
```

Install via **NPM:**

```bash
npm install satellizer --save
```

**:exclamation: Note:** Alternatively, you may just manually grab `satellizer.js` or `satellizer.min.js` from the **lib** directory.

## Usage

This example demonstrates end-to-end sign-in process using AngularJS, Node.js and MongoDB. For other languages and server-side frameworks see **examples** directory.

### Client-side

**app.js**
Include `Satellizer` just as any other AngularJS module. The `$authProvider` can then be injected into the [configuration block](https://docs.angularjs.org/guide/module) of your application. You do not need to give much information for pre-defined OAuth providers as it has already been done for you.

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

**controllers/login.js**
The `$auth` provider can now be injected into your controllers. Since we are in the
*run phase* and not the *configuration phase* at this point, we can drop the `Provider` postfix.
 
```js
angular.module('MyApp')
  .controller('LoginCtrl', function($scope, $auth) {
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider).then(function() {
        console.log('Authenticated!');
      });
    }
  });
```

**views/login.html**
The `$auth.authenticate` expects a valid provider name, i.e. *facebook*, *google*,
 *linkedin*, *twitter* or any custom provider that you have created in the config
 block.

```html
<button ng-click="authenticate('facebook')">Sign in with Facebook</button>
```

### Server-side

After user enters his/her Facebook credentials, a *POST* request is made to this end-point with the `code` object, which stands for `authorization_code`. The code is then exchanged for an `access_token`. And finally access token is used to query the [Graph API](https://developers.facebook.com/docs/graph-api) to get user's profile information. It is then checks if it's a new or a returning user. And finally it generates a *JSON Web Token* that is sent back to the client.

```js
app.post('/auth/facebook', function(req, res, next) {
  var url = 'https://graph.facebook.com/oauth/access_token';
  var params = qs.stringify({
    redirect_uri: req.body.redirectUri,
    client_secret: config.facebookSecret,
    client_id: req.body.clientId,
    code: req.body.code
  });

  request.get([url, params].join('?'), function(error, response, data) {
    var accessToken = qs.parse(data).access_token;
    var graphApiUrl = 'https://graph.facebook.com/me';
    var params = {
      access_token: accessToken
    };
    request.get({ url: graphApiUrl, qs: params, json: true }, function(error, response, profile) {
      User.findOne({ facebook: profile.id }, function(err, existingUser) {
        if (existingUser) {
          var token = createJwtToken(existingUser);
          return res.send(token);
        }
        var user = new User({
          facebook: profile.id,
          firstName: profile.first_name,
          lastName: profile.last_name
        });
        user.save(function(err) {
          if (err) return next(err);
          var token = createJwtToken(user);
          res.send(token);
        });
      });
    });
  });
});
```


## Configuration

Below is a complete listing of all config options.

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
It relies on *Token-Based Authentication* with [JSON Web Tokens](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/) instead of cookies and sessions.


## Obtaining OAuth Keys

<img src="http://images.google.com/intl/en_ALL/images/srpr/logo6w.png" width="200">
- Visit [Google Cloud Console](https://cloud.google.com/console/project)
- Click **CREATE PROJECT** button
- Enter *Project Name*, then click **CREATE**
- Then select *APIs & auth* from the sidebar and click on *Credentials* tab
- Click **CREATE NEW CLIENT ID** button
 - **Application Type**: Web Application
 - **Authorized Javascript origins**: http://localhost:3000
 - **Authorized redirect URI**: http://localhost:3000

<hr>

<img src="http://www.doit.ba/img/facebook.jpg" width="200">
- Visit [Facebook Developers](https://developers.facebook.com/)
- Click **Apps > Create a New App** in the navigation bar
- Enter *Display Name*, then choose a category, then click **Create app**
- Click on *Settings* on the sidebar, then click **+ Add Platform**
- Select **Website**
- Enter `http://localhost:3000` for *Site URL*

<hr>

<img src="https://g.twimg.com/Twitter_logo_blue.png" width="90">
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