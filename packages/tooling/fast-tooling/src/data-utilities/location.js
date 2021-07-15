export const squareBracketsRegex = /\[(\d+)\]/g;
export const firstCharacterDotRegex = /^(\.)/;
/**
 * Converts all property locations to dot notation
 */
export function normalizeDataLocationToDotNotation(dataLocation) {
    return dataLocation
        .replace(squareBracketsRegex, `.$1`)
        .replace(firstCharacterDotRegex, "");
}
