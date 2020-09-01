"use strict";

const { BetaConfigure } = require("./config-browsers.beta.js");

const ReleaseConfigure = [
    ...BetaConfigure,
    {
        'platform': 'Windows 8.1',
        'browserName': 'internet explorer',
        'version': '11.0',
        'screenResolution': '1024x768'
    },
    {
        'platform': 'Windows 10',
        'browserName': 'chrome',
        'version': '67.0',
        'screenResolution': '1920x1200'
    },
    {
        'platform': 'macOS 10.12',
        'browserName': 'safari',
        'version': '11.0',
        'screenResolution': '2048x1536'
    },
    {
        'platform': 'macOS 10.12',
        'browserName': 'safari',
        'version': '10.1',
        'screenResolution': '2360x1770'
    },
    {
        'platform': 'macOS 10.13',
        'browserName': 'firefox',
        'version': '62.0',
        'screenResolution': '2360x1770'
    },
    {
        'platform': 'OS X 10.11',
        'browserName': 'chrome',
        'version': '69.0',
        'screenResolution': '2048x1536'
    },
    {
        'platformName': 'iOS',
        'platformVersion': '11.2',
        'deviceOrientation': 'PORTRAIT',
        'deviceName': 'iPhone 8 Plus Simulator',
        'appiumVersion': '1.8.1',
        'browserName': 'Safari'
    },
    {
        'platformName': 'iOS',
        'platformVersion': '11.1',
        'deviceOrientation': 'PORTRAIT',
        'deviceName': 'iPhone 7 Simulator',
        'appiumVersion': '1.8.1',
        'browserName': 'Safari'
    },
    {
        'platformName': 'iOS',
        'platformVersion': '10.0',
        'deviceOrientation': 'PORTRAIT',
        'deviceName': 'iPad Retina Simulator',
        'appiumVersion': '1.8.0',
        'browserName': 'Safari'
    },
    {
        'platformName': 'iOS',
        'platformVersion': '11.0',
        'deviceOrientation': 'PORTRAIT',
        'deviceName': 'iPhone 6s Simulator',
        'appiumVersion': '1.8.1',
        'browserName': 'Safari'
    },
    {
        'platformName': 'Android',
        'platformVersion': '7.1',
        'deviceOrientation': 'PORTRAIT',
        'deviceName': 'Samsung Galaxy S7 Edge FHD GoogleAPI Emulator',
        'appiumVersion': '1.8.1',
        'browserName': 'Chrome',
        'language': 'en',
        'locale': 'en_US'
    },
    {
        'platformName': 'Android',
        'platformVersion': '7.0',
        'deviceOrientation': 'PORTRAIT',
        'deviceName': 'Samsung Galaxy Tab A 10 GoogleAPI Emulator',
        'appiumVersion': '1.8.1',
        'browserName': 'Chrome',
        'language': 'en',
        'locale': 'en_US'
    },
    {
        'platformName': 'Android',
        'platformVersion': '5.1',
        'deviceOrientation': 'PORTRAIT',
        'deviceName': 'Android GoogleAPI Emulator',
        'appiumVersion': '1.8.1',
        'browserName': 'Browser'
    },
    {
        'platformName': 'Android',
        'platformVersion': '5.0',
        'deviceOrientation': 'PORTRAIT',
        'deviceName': 'Android Emulator',
        'appiumVersion': '1.8.1',
        'browserName': 'Browser'
    },
    {
        'platformName': 'Android',
        'platformVersion': '4.4',
        'deviceOrientation': 'PORTRAIT',
        'deviceName': 'LG Nexus 4 Emulator',
        'appiumVersion': '1.8.1',
        'browserName': 'Browser'
    }
];

exports.ReleaseConfigure = ReleaseConfigure;