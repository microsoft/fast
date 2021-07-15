/**
 * Builds a string from a format specifier and replacement parameters.
 */
export declare function format(formatSpecifier: string, ...parameters: string[]): string;
/**
 * Check to see if one string starts with another
 */
export declare function startsWith(
    stringToSearch: string,
    searchFor: string,
    position?: number
): boolean;
/**
 * Determines if the specified string is undefined, null, empty, or whitespace.
 * True if the value is undefined, null, empty, or whitespace, otherwise false.
 */
export declare function isNullOrWhiteSpace(value: string): boolean;
/**
 * Converts a string to Pascal Case
 */
export declare function pascalCase(value: string): string;
/**
 * converts a string from camelCase or pascalCase to spinal-case
 * which is an lowercase dash separated naming style.
 *
 * An example of spinal case: foo-bar-bat
 */
export declare function spinalCase(value: string): string;
