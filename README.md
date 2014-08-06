![Project Logo](https://lh6.googleusercontent.com/-YmfKZZLZKL0/U-KVPFSbiOI/AAAAAAAAEZA/maoYT8iJCnA/w1089-h513-no/sshot-1.png)

# Satellizer [![Build Status](https://travis-ci.org/sahat/ngAuth.svg?branch=master)](https://travis-ci.org/sahat/ngAuth) [![Code Climate](http://img.shields.io/codeclimate/github/sahat/ngAuth.svg)](https://codeclimate.com/github/sahat/ngAuth)  [![GitHub Release](http://img.shields.io/github/release/qubyte/rubidium.svg
)]

:octocat: **Live Demo:** [http://satellizer.herokuapp.com](#)

Introduction....

<Screenshot with popup>

## Features (optional)

< bullet list >

## Install

Using **Bower:**
```bash
bower install satellizer
```

Using **npm:**

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

<hapi joi>

## License

The MIT License (MIT)

Copyright (c) 2014 Sahat Yalkabov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.