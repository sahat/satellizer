<img src="http://ionicframework.com/img/ionic-logo-blue.svg">

Ionic is the beautiful, open source front-end SDK for developing hybrid mobile apps with web technologies.

## Usage

1. First, install [Node.js](https://nodejs.org/en/). Then, install the latest Cordova and Ionic command-line tools:
 - `sudo npm install -g cordova ionic`
 - **Note**: iOS development requires Mac OS X. iOS simulator through the Ionic CLI requires the `ios-sim` npm package, which can be installed with the command `sudo npm -g install ios-sim`.
4. Install dependencies with `npm install`.
5. <img src="http://cnet2.cbsistatic.com/hub/i/r/2011/10/05/74df5391-fdc1-11e2-8c7c-d4ae52e62bcc/resize/370xauto/26609a1fcbb66cad8783b098ebf0ed80/apple-logo-2.jpg" height="16"> **iOS**
 - `ionic build ios`
 - `ionic emulate ios`
6. <img src="http://icons.iconarchive.com/icons/carlosjj/google-jfk/128/android-icon.png" height="17"> **Android**
 - `ionic platform add android`
 - `ionic build android`
 - `ionic emulate android`
