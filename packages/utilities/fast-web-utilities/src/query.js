/**
 * @param input Can be in the form ANYTHING?a=1&b=2&c=3  ... or just a=1&b=2&c=3 ...
 *              all query string keys and values will be run through decodeURIComponent
 */
export function parseQueryStringParams(input) {
    const retVal = new Map();
    if (typeof input !== "string" || input.length <= 0) {
        return retVal;
    }
    const splitLocation = input.split("?");
    let rawQuery;
    if (splitLocation.length === 1) {
        rawQuery = splitLocation[0];
    } else {
        rawQuery = splitLocation[1];
    }
    const querySegments = rawQuery.split("&");
    for (const querySegment of querySegments) {
        const paramSegments = querySegment.split("=");
        if (paramSegments.length === 2) {
            retVal.set(
                decodeURIComponent(paramSegments[0]),
                decodeURIComponent(paramSegments[1])
            );
        }
    }
    return retVal;
}
