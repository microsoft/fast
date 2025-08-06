/**
 * This file was ported from {@link https://github.com/lit/lit/tree/main/packages/labs/ssr}.
 * Please see {@link ../ACKNOWLEDGEMENTS.md}
 */

const replacements = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    // Note &apos; was not defined in the HTML4 spec, and is not supported by very
    // old browsers like IE8, so a codepoint entity is used instead.
    "'": "&#39;",
};

/**
 * Replaces characters which have special meaning in HTML (&<>"') with escaped
 * HTML entities ("&amp;", "&lt;", etc.).
 */
export const escapeHtml = (str: string) =>
    str.replace(/[&<>"']/g, char => replacements[char as keyof typeof replacements]);
