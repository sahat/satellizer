![Project Logo](https://lh6.googleusercontent.com/-YmfKZZLZKL0/U-KVPFSbiOI/AAAAAAAAEZA/maoYT8iJCnA/w1089-h513-no/sshot-1.png)

# Satellizer 
[![Build Status](https://travis-ci.org/sahat/satellizer.svg?branch=master)](https://travis-ci.org/sahat/satellizer) 
[![Code Climate](http://img.shields.io/codeclimate/github/sahat/satellizer.svg)](https://codeclimate.com/github/sahat/satellizer) 
[![Coverage](http://img.shields.io/codeclimate/coverage/github/satellizer/satellizer.svg)](https://codeclimate.com/github/sahat/satellizer)
[![GitHub Tag](http://img.shields.io/github/tag/sahat/satellizer.svg)](https://github.com/sahat/satellizer/tags)

**:octocat: Demo:** [http://satellizer.herokuapp.com](http://satellizer.herokuapp.com)

**Satellizer** is a simple to use, end-to-end, token-based authentication module for [AngularJS](http://angularjs.org) with built-in support for Google, Facebook, LinkedIn, Twitter and Email & Password sign-in methods. You are not limited to the sign-in options above, in fact you can add any *OAuth 1.0* or *OAuth 2.0* provider by passing provider-specific information during the configuration step.

Unlike many other modules and code examples, **Satellizer** uses *popups* instead of *page redirects* for authentication with third-party providers. So, in that respect it is closer to [Torii](http://vestorly.github.io/torii/demo.html) than [angular-client-side-auth](http://angular-client-side-auth.herokuapp.com/) project. Personally, I believe that in a *single-page application* authentication via a popup provides a slightly better user experience than a page redirect.

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

**Note:** Alternatively, you may just manually grab `satellizer.js` or `satellizer.min.js` from the **lib/** directory.

## Usage

This example demonstrates end-to-end sign-in process using AngularJS, Node.js and MongoDB. For other languages and server-side frameworks see **examples/** directory.

### Client-side

Include `Satellizer` just as any other AngularJS module. The `$authProvider` can then be injected into the [configuration block](https://docs.angularjs.org/guide/module) of your application. You do not need to give much information for pre-defined OAuth providers as I have already done that for you.

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

**controllers/login.js**
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



## How It Works
It relies on *Token-Based Authentication* with [JSON Web Tokens](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/) instead of cookies and sessions.


## OAuth Credentials

Google
Facebook
LinkedIn
Twitter

## API Reference

- [`any`](#any)
  - [`any.allow(value)`](#anyallowvalue)
  - [`any.valid(value)`](#anyvalidvalue)
  - [`any.invalid(value)`](#anyinvalidvalue)
  - [`any.required()`](#anyrequired)
  - [`any.optional()`](#anyoptional)
  - [`any.forbidden()`](#anyforbidden)
  - [`any.description(desc)`](#anydescriptiondesc)
  - [`any.notes(notes)`](#anynotesnotes)
  - [`any.tags(tags)`](#anytagstags)
  - [`any.meta(meta)`](#anymetameta)
  - [`any.example(value)`](#anyexamplevalue)
  - [`any.unit(name)`](#anyunitname)
  - [`any.options(options)`](#anyoptionsoptions)
  - [`any.strict()`](#anystrict)
  - [`any.default(value)`](#anydefaultvalue)
  - [`any.concat(schema)`](#anyconcatschema)
  - [`any.when(ref, options)`](#anywhenref-options)
- [`array`](#array)
  - [`array.includes(type)`](#arrayincludestype)
  - [`array.excludes(type)`](#arrayexcludestype)
  - [`array.min(limit)`](#arrayminlimit)
  - [`array.max(limit)`](#arraymaxlimit)
  - [`array.length(limit)`](#arraylengthlimit)

#### `any.tags(tags)`

Annotates the key where:
- `tags` - the tag string or array of strings.

```javascript
var schema = Joi.any().tags(['api', 'user']);
```

#### `any.meta(meta)`

Attaches metadata to the key where:
- `meta` - the meta object to attach.

```javascript
var schema = Joi.any().meta({ index: true });
```

#### `any.example(value)`

Annotates the key where:
- `value` - an example value.

If the example fails to pass validation, the function will throw.

```javascript
var schema = Joi.string().min(4).example('abcd');
```

## License

The MIT License (MIT)

Copyright (c) 2014 Sahat Yalkabov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.