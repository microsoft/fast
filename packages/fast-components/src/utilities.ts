/**
 * Process attribute values into a boolean value. Remove this
 * when proper @attr modes are supported.
 * https://github.com/microsoft/fast-dna/issues/2742
 */
export function bool(value: string | boolean | null): boolean {
    return typeof value === "boolean" ? value : typeof value === "string";
}
