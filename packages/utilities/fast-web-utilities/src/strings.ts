let uniqueIdCounter: number = 0;

/**
 * Generates a unique ID based on incrementing a counter.
 */
export function uniqueId(prefix: string = ""): string {
    return `${prefix}${uniqueIdCounter++}`;
}

/**
 * Builds a string from a format specifier and replacement parameters.
 */
export function format(formatSpecifier: string, ...parameters: string[]): string {
    return formatSpecifier.replace(
        /{(\d+)}/g,
        function (match: string, index: number): any {
            if (index >= parameters.length) {
                return match;
            }

            const value: string = parameters[index];

            if (typeof value !== "number" && !value) {
                return "";
            }

            return value;
        }
    );
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
 * where the first letter of each compound word is capitalized.
 */
export function pascalCase(value: string): string {
    let newValue: string = `${value}`
        .replace(new RegExp(/[-_]+/, "g"), " ")
        .replace(new RegExp(/[^\w\s]/, "g"), "")
        .replace(/^\s+|\s+$|\s+(?=\s)/g, "")
        .replace(
            new RegExp(/\s+(.)(\w*)/, "g"),
            ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
        )
        .replace(new RegExp(/\w/), s => s.toUpperCase());

    let firstLowerIdx: number = 0;

    for (let i = 0; i < newValue.length; i++) {
        const currChar: string = newValue.charAt(i);

        if (currChar == currChar.toLowerCase()) {
            firstLowerIdx = i;
            break;
        }
    }

    if (firstLowerIdx > 1) {
        newValue =
            `${newValue.charAt(0).toUpperCase()}${newValue
                .slice(1, firstLowerIdx - 1)
                .toLowerCase()}` + newValue.slice(firstLowerIdx - 1);
    }

    return newValue;
}

/**
 * converts a string from camelCase or pascalCase to spinal-case
 * which is an lowercase dash separated naming style.
 *
 * An example of spinal case: foo-bar-bat
 */
export function spinalCase(value: string): string {
    const valueWithLowerCaseFirstLetter: string = `${value
        .charAt(0)
        .toLowerCase()}${value.slice(1)}`;

    return valueWithLowerCaseFirstLetter.replace(
        /([A-Z]|[0-9])/g,
        function (match: string, group1: string): string {
            return `-${group1.toLowerCase()}`;
        }
    );
}
