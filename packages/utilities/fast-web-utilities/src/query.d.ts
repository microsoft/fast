/**
 * @param input Can be in the form ANYTHING?a=1&b=2&c=3  ... or just a=1&b=2&c=3 ...
 *              all query string keys and values will be run through decodeURIComponent
 */
export declare function parseQueryStringParams(input: string): Map<string, string>;
