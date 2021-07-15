import { camelCase } from "lodash-es";
/**
 * Builds a string from a format specifier and replacement parameters.
 */
export function format(formatSpecifier, ...parameters) {
    return formatSpecifier.replace(/{(\d+)}/g, function (match, index) {
        if (index >= parameters.length) {
            return match;
        }
        const value = parameters[index];
        if (typeof value !== "number" && !value) {
            return "";
        }
        return value;
    });
}
/**
 * Check to see if one string starts with another
 */
export function startsWith(stringToSearch, searchFor, position = 0) {
    if (!stringToSearch || !searchFor) {
        return false;
    }
    return stringToSearch.substr(position, searchFor.length) === searchFor;
}
/**
 * Determines if the specified string is undefined, null, empty, or whitespace.
 * True if the value is undefined, null, empty, or whitespace, otherwise false.
 */
export function isNullOrWhiteSpace(value) {
    return !value || !value.trim();
}
/**
 * Converts a string to Pascal Case
 */
export function pascalCase(value) {
    const camelCased = camelCase(value);
    return `${camelCased.charAt(0).toUpperCase()}${camelCased.slice(1)}`;
}
/**
 * converts a string from camelCase or pascalCase to spinal-case
 * which is an lowercase dash separated naming style.
 *
 * An example of spinal case: foo-bar-bat
 */
export function spinalCase(value) {
    const valueWithLowerCaseFirstLetter = `${value.charAt(0).toLowerCase()}${value.slice(
        1
    )}`;
    return valueWithLowerCaseFirstLetter.replace(/([A-Z])/g, function (match, group1) {
        return `-${group1.toLowerCase()}`;
    });
}
