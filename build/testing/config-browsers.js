"use strict";

const { AlphaConfigure } = require("./config-browsers.alpha.js");
const { BetaConfigure } = require("./config-browsers.beta.js");
const { ReleaseConfigure } = require("./config-browsers.release.js");

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
                return AlphaConfigure;
            case Phase.beta:
                return BetaConfigure;
            case Phase.release:
            default:
                return ReleaseConfigure;
        }
    }

    return _configure;
})();

exports.Configure = Configure;
