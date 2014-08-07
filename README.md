![Project Logo](https://lh6.googleusercontent.com/-YmfKZZLZKL0/U-KVPFSbiOI/AAAAAAAAEZA/maoYT8iJCnA/w1089-h513-no/sshot-1.png)

# Satellizer 
[![Build Status](https://travis-ci.org/sahat/satellizer.svg?branch=master)](https://travis-ci.org/sahat/satellizer) 
[![Code Climate](http://img.shields.io/codeclimate/github/sahat/satellizer.svg)](https://codeclimate.com/github/sahat/satellizer) 
[![Coverage](http://img.shields.io/codeclimate/coverage/github/satellizer/satellizer.svg)](https://codeclimate.com/github/sahat/satellizer)
[![GitHub Tag](http://img.shields.io/github/tag/sahat/satellizer.svg)](https://github.com/sahat/satellizer/tags)

**:octocat: Demo:** [http://satellizer.herokuapp.com](http://satellizer.herokuapp.com)

**Satellizer** is a simple to use authentication module for [AngularJS](http://angularjs.org) with built-in support for Google, Facebook, LinkedIn and Twitter OAuth providers, as well as email and password authentication. You are not limited to the above sign-in options, you could easily add your own OAuth 1.0 or OAuth 2.0 provider by passing provider-specific information during the configuration phase.

![Screenshot](https://lh4.googleusercontent.com/-0UUIecT-3N4/U-LQJkd75iI/AAAAAAAAEZY/YN3Oe-eUPGc/w1676-h1158-no/satellizer.png)

## Features (optional)

< bullet list >

## Install

<img src="http://bower.io/img/bower-logo.png" height="17"> Using **Bower:**

```bash
bower install satellizer
```

<img src="http://www.codeasearch.com/wp-content/uploads/2014/04/npm-logo.png" height="17"> Using **npm:**

```bash
npm install satellizer
```

## Usage

```js
angular.module('MyApp', ['ngAuth']).config(function($authProvider) {

  $authProvider.loginUrl = '/login';
  
  $authProvider.setProvider({
    name: 'facebook',
    clientId: '624059410963642'
  });
  
});
```


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