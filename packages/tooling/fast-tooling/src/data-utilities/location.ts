export const squareBracketsRegex: RegExp = /\[(\d+)\]/g;
export const firstCharacterDotRegex: RegExp = /^(\.)/;

/**
 * Converts all property locations to dot notation
 */
export function normalizeDataLocationToDotNotation(dataLocation: string): string {
    return dataLocation
        .replace(squareBracketsRegex, `.$1`)
        .replace(firstCharacterDotRegex, "");
}
