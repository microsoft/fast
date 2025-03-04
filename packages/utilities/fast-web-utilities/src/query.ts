/**
 * @param input Can be in the form ANYTHING?a=1&b=2&c=3  ... or just a=1&b=2&c=3 ...
 *              all query string keys and values will be run through decodeURIComponent
 */
export function parseQueryStringParams(input: string): Map<string, string> {
    const retVal: Map<string, string> = new Map<string, string>();
    if (typeof input !== "string" || input.length <= 0) {
        return retVal;
    }
    const splitLocation: string[] = input.split("?");
    let rawQuery: string;
    if (splitLocation.length === 1) {
        rawQuery = splitLocation[0];
    } else {
        rawQuery = splitLocation[1];
    }
    const querySegments: string[] = rawQuery.split("&");
    for (const querySegment of querySegments) {
        const paramSegments: string[] = querySegment.split("=");
        if (paramSegments.length === 2) {
            retVal.set(
                decodeURIComponent(paramSegments[0]),
                decodeURIComponent(paramSegments[1])
            );
        }
    }
    return retVal;
}
