"use strict";

const { AlphaConfigure } = require("./config-browsers.alpha.js");

const BetaConfigure = [
    ...AlphaConfigure,
    {
        'platformName': 'iOS',
        'platformVersion': '9.3',
        'deviceOrientation': 'PORTRAIT',
        'deviceName': 'iPad Pro Simulator',
        'appiumVersion': '1.7.1',
        'browserName': 'Safari'
    }
];

exports.BetaConfigure = BetaConfigure;