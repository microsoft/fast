import { camelCase } from "lodash-es";

/**
 * Builds a string from a format specifier and replacement parameters.
 */
export function format(formatSpecifier: string, ...parameters: string[]): string {
    return formatSpecifier.replace(/{(\d+)}/g, function(
        match: string,
        index: number
    ): any {
        if (index >= parameters.length) {
            return match;
        }

        const value: string = parameters[index];

        if (typeof value !== "number" && !value) {
            return "";
        }

        return value;
    });
}

/**
 * Check to see if one string starts with another
 */
export function startsWith(
    stringToSearch: string,
    searchFor: string,
    position: number = 0
): boolean {
    if (!stringToSearch || !searchFor) {
        return false;
    }

    return stringToSearch.substr(position, searchFor.length) === searchFor;
}

/**
 * Determines if the specified string is undefined, null, empty, or whitespace.
 * True if the value is undefined, null, empty, or whitespace, otherwise false.
 */
export function isNullOrWhiteSpace(value: string): boolean {
    return !value || !value.trim();
}

/**
 * Converts a string to Pascal Case
 */
export function pascalCase(value: string): string {
    const camelCased: string = camelCase(value);

    return `${camelCased.charAt(0).toUpperCase()}${camelCased.slice(1)}`;
}
