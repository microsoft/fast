/**
 * Checks to see if an object has no enumerable properties
 */
export function isEmptyObject(obj: any): boolean {
    if (Boolean(obj)) {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    }

    return false;
}
