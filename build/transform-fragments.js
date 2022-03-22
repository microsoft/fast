/**
 * Reduces extra spaces in HTML tagged templates.
 *
 * @param {string} data - the fragment value
 * @returns string
 */
export function transformHTMLFragment(data) {
    data = data.replace(/\s*([<>])\s*/g, "$1"); // remove spaces before and after angle brackets
    return data.replace(/\s{2,}/g, " "); // Collapse all sequences to 1 space
}

/**
 * Reduces extra spaces in CSS tagged templates.
 *
 * Breakdown of this regex:
 *   (?:\s*\/\*(?:[\s\S])+?\*\/\s*)  Remove comments (non-capturing)
 *   (?:;)\s+(?=\})  Remove semicolons and spaces followed by property list end (non-capturing)
 *   \s+(?=\{)  Remove spaces before property list start (non-capturing)
 *   (?<=:)\s+  Remove spaces after property declarations (non-capturing)
 *   \s*([{};,])\s*  Remove extra spaces before and after braces, semicolons, and commas (captures)
 *
 * @param {string} data - the fragment value
 * @returns string
 */
export function transformCSSFragment(data) {
    if (/\/\*(?![\s\S]*\*\/)[\s\S]*/g.test(data)) {
        throw new Error("Unterminated comment found in CSS tagged template literal");
    }

    return data.replace(
        /(?:\s*\/\*(?:[\s\S])+?\*\/\s*)|(?:;)\s+(?=\})|\s+(?=\{)|(?<=:)\s+|\s*([{};,])\s*/g,
        "$1"
    );
}
