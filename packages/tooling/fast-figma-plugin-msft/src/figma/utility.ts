/**
 * Gets a string representation of `isTrue` based on the format of `booleanString`.
 *
 * Figma supports component properties like "true", "True", "yes", and "Yes", but doesn't doi the work to interpret it.
 *
 * Assumes the value is paired with the same case and set (i.e. "Yes" / "No", "true" / "false", etc.).
 */
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const variantBooleanHelper = (booleanString: string) => (isTrue: boolean) =>
    [
        ["No", "Yes"],
        ["False", "True"],
    ]
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .find(bools => bools.find(b => b.toLowerCase() === booleanString.toLowerCase())!)!
        .map(b => (booleanString.match(/^[nytf]/) ? b.toLowerCase() : b))[
        !isTrue ? 0 : 1
    ];
