"use strict";
exports.__esModule = true;
var lodash_es_1 = require("lodash-es");
/**
 * Merges design-system values. Only plain Object values will be merged recursively,
 * all other values will be merged by assignment.
 *
 * This function returns a new object
 */
function mergeDesignSystem(original, overrides) {
    return lodash_es_1.mergeWith({}, original, overrides, function(objValue, srcValue) {
        if (Array.isArray(srcValue)) {
            return srcValue;
        }
    });
}
exports.mergeDesignSystem = mergeDesignSystem;
