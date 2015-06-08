#!/usr/bin/env node

// This hook installs all cordova plugins.

// Add plugins to this list - either the identifier or the URL.
var pluginlist = [
  'org.apache.cordova.device@0.2.12',
  'org.apache.cordova.console@0.2.11',
  'cordova-plugin-inappbrowser@1.0.0',
  'com.ionic.keyboard@1.0.3',
  'com.pushwoosh.plugins.pushwoosh@3.3.0',
  'https://bitbucket.org/180vita/cordova-adjust-sdk/',
  'com.danielcwilson.plugins.googleanalytics@0.6.0',
  'org.apache.cordova.statusbar@0.1.8'
];

// No need to configure anything below.

var fs = require('fs');
var path = require('path');
var sys = require('sys')
var exec = require('child_process').exec;

function puts(error, stdout, stderr) {
    sys.puts(stdout)
}

pluginlist.forEach(function(plugin) {
    exec("cordova plugin add " + plugin, puts);
});
