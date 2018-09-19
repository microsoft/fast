"use strict";

/**
 * Cross Browser Configuration
 *
 * Different subsets of cross browser / device configurations are used to test 
 * projects or packages with user interafaces or experiences.
 *
 * As projects move through the different 'Phases' of development testing 
 * scenarios increase to become more comprehensive across browsers.
 *
 * The configurations require updating over time as new browser versions are 
 * released or as known unstable combinations become apparent.
 *
 */
const Windows8_IE = {
    'platform': 'Windows 8.1',
    'browserName': 'internet explorer',
    'version': '11.0',
    'screenResolution': '1024x768'
};
const Windows10_MicrosoftEdge = {
    'platform': 'Windows 10',
    'browserName': 'MicrosoftEdge',
    'version': '17.17134',
    'screenResolution': '1280x1024'
};
const Windows10_IE = {
    'platform': 'Windows 10',
    'browserName': 'internet explorer',
    'version': '11.103',
    'screenResolution': '1400x1050'
};
const Windows10_Chrome_68 = {
    'platform': 'Windows 10',
    'browserName': 'chrome',
    'version': '68.0',
    'screenResolution': '1920x1200'
};
const Windows10_Chrome_67 = {
    'platform': 'Windows 10',
    'browserName': 'chrome',
    'version': '67.0',
    'screenResolution': '1920x1200'
};
const Windows10_Firefox = {
    'platform': 'Windows 10',
    'browserName': 'firefox',
    'version': '61.0',
    'screenResolution': '2560x1600'
};
const MacOS10_Safari_11_1 = {
    'platform': 'macOS 10.13',
    'browserName': 'safari',
    'version': '11.1',
    'screenResolution': '2048x1536'
};
const MacOS10_Safari_11_0 = {
    'platform': 'macOS 10.12',
    'browserName': 'safari',
    'version': '11.0',
    'screenResolution': '2048x1536'
};
const MacOS10_Safari_10_1 = {
    'platform': 'macOS 10.12',
    'browserName': 'safari',
    'version': '10.1',
    'screenResolution': '2360x1770'
};
const MacOS10_Firefox = {
    'platform': 'macOS 10.13',
    'browserName': 'firefox',
    'version': '62.0',
    'screenResolution': '2360x1770'
};
const MacOS10_Chrome = {
    'platform': 'OS X 10.11',
    'browserName': 'chrome',
    'version': '69.0',
    'screenResolution': '2048x1536'
};
const IOS_IPhoneX_Safari_Portrait = {
    'platformName': 'iOS',
    'platformVersion': '11.3',
    'deviceOrientation': 'PORTRAIT',
    'deviceName': 'iPhone X Simulator',
    'appiumVersion': '1.8.1',
    'browserName': 'Safari'
};
const IOS_IPhone8_Safari_Portrait = {
    'platformName': 'iOS',
    'platformVersion': '11.2',
    'deviceOrientation': 'PORTRAIT',
    'deviceName': 'iPhone 8 Plus Simulator',
    'appiumVersion': '1.8.1',
    'browserName': 'Safari'
};
const IOS_IPhone7_Safari_Portrait = {
    'platformName': 'iOS',
    'platformVersion': '11.1',
    'deviceOrientation': 'PORTRAIT',
    'deviceName': 'iPhone 7 Simulator',
    'appiumVersion': '1.8.1',
    'browserName': 'Safari'
};
const IOS_IPadPro_Safari_Portrait = {
    'platformName': 'iOS',
    'platformVersion': '9.3',
    'deviceOrientation': 'PORTRAIT',
    'deviceName': 'iPad Pro Simulator',
    'appiumVersion': '1.7.1',
    'browserName': 'Safari'
};
const IOS_IPad_Safari_Portrait = {
    'platformName': 'iOS',
    'platformVersion': '10.0',
    'deviceOrientation': 'PORTRAIT',
    'deviceName': 'iPad Retina Simulator',
    'appiumVersion': '1.8.0',
    'browserName': 'Safari'
};
const IOS_IPhone6S_Safari_Portrait = {
    'platformName': 'iOS',
    'platformVersion': '11.0',
    'deviceOrientation': 'PORTRAIT',
    'deviceName': 'iPhone 6s Simulator',
    'appiumVersion': '1.8.1',
    'browserName': 'Safari'
};
const Android_7_1_Chrome_Portrait = {
    'platformName': 'Android',
    'platformVersion': '7.1',
    'deviceOrientation': 'PORTRAIT',
    'deviceName': 'Samsung Galaxy S7 Edge FHD GoogleAPI Emulator',
    'appiumVersion': '1.8.1',
    'browserName': 'Chrome',
    'language': 'en',
    'locale': 'en_US'
};
const Android_7_0_Chrome_Portrait = {
    'platformName': 'Android',
    'platformVersion': '7.0',
    'deviceOrientation': 'PORTRAIT',
    'deviceName': 'Samsung Galaxy Tab A 10 GoogleAPI Emulator',
    'appiumVersion': '1.8.1',
    'browserName': 'Chrome',
    'language': 'en',
    'locale': 'en_US'
};
const Android_6_0_Chrome_Portrait = {
    'platformName': 'Android',
    'platformVersion': '6.0',
    'deviceOrientation': 'PORTRAIT',
    'deviceName': 'Android Emulator',
    'appiumVersion': '1.8.1',
    'browserName': 'Chrome',
    'language': 'en',
    'locale': 'en_US'
};
const Android_5_1_Chrome_Portrait = {
    'platformName': 'Android',
    'platformVersion': '5.1',
    'deviceOrientation': 'PORTRAIT',
    'deviceName': 'Android GoogleAPI Emulator',
    'appiumVersion': '1.8.1',
    'browserName': 'Browser'
};
const Android_5_0_Chrome_Portrait = {
    'platformName': 'Android',
    'platformVersion': '5.0',
    'deviceOrientation': 'PORTRAIT',
    'deviceName': 'Android Emulator',
    'appiumVersion': '1.8.1',
    'browserName': 'Browser'
};
const Android_4_4_Chrome_Portrait = {
    'platformName': 'Android',
    'platformVersion': '4.4',
    'deviceOrientation': 'PORTRAIT',
    'deviceName': 'LG Nexus 4 Emulator',
    'appiumVersion': '1.8.1',
    'browserName': 'Browser'
};

 /**
 * Phases of software development
 * @type Enum
*/
const Phase = Object.freeze({
    "alpha": "alpha",
    "beta": "beta",
    "release": "release"
})

exports.Phase = Phase;

/**
 * Platform configurations sourced from Selenium and Appium online Configurators.  
 * 
 * @see 
 * https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/
 * https://www.browserstack.com/automate/node 
 */
var Configure = (function () {
    function _configure(phase) {

        switch (phase) {
            case Phase.alpha:
                return [
                    Windows10_MicrosoftEdge,
                    Windows10_IE,
                    Windows10_Chrome_68,
                    Windows10_Firefox,
                    MacOS10_Safari_11_1,
                    IOS_IPhoneX_Safari_Portrait,
                    Android_6_0_Chrome_Portrait
                ];
            case Phase.beta:
                return [
                    Windows10_MicrosoftEdge,
                    Windows10_IE,
                    Windows10_Chrome_68,
                    Windows10_Firefox,
                    MacOS10_Safari_11_1,
                    IOS_IPhoneX_Safari_Portrait,
                    IOS_IPadPro_Safari_Portrait,
                    Android_6_0_Chrome_Portrait
                ];
            case Phase.release:
            default:
                return [
                    Windows8_IE,
                    Windows10_MicrosoftEdge,
                    Windows10_IE,
                    Windows10_Chrome_68,
                    Windows10_Chrome_67,
                    Windows10_Firefox,
                    MacOS10_Safari_11_1,
                    MacOS10_Safari_11_0,
                    MacOS10_Safari_10_1,
                    MacOS10_Firefox,
                    MacOS10_Chrome,
                    IOS_IPhoneX_Safari_Portrait,
                    IOS_IPhone8_Safari_Portrait,
                    IOS_IPhone7_Safari_Portrait,
                    IOS_IPhone6S_Safari_Portrait,
                    IOS_IPad_Safari_Portrait,
                    IOS_IPadPro_Safari_Portrait,
                    Android_7_1_Chrome_Portrait,
                    Android_7_0_Chrome_Portrait,
                    Android_6_0_Chrome_Portrait,
                    Android_5_1_Chrome_Portrait,
                    Android_5_0_Chrome_Portrait,
                    Android_4_4_Chrome_Portrait
                ];
        }
    }

    return _configure;
})();

exports.Configure = Configure;
