const encode = encodeURIComponent;
const encodeKey = (key: string) => encode(key).replace("%24", "$");

function buildParam(key: string, value: any, traditional?: boolean): Array<string> {
    let result: string[] = [];

    if (value === null || value === undefined) {
        return result;
    }

    if (Array.isArray(value)) {
        for (let i = 0, l = value.length; i < l; i++) {
            if (traditional) {
                result.push(`${encodeKey(key)}=${encode(value[i])}`);
            } else {
                let arrayKey =
                    key +
                    "[" +
                    (typeof value[i] === "object" && value[i] !== null ? i : "") +
                    "]";
                result = result.concat(buildParam(arrayKey, value[i]));
            }
        }
    } else if (typeof value === "object" && !traditional) {
        for (let propertyName in value) {
            result = result.concat(
                buildParam(key + "[" + propertyName + "]", value[propertyName])
            );
        }
    } else {
        result.push(`${encodeKey(key)}=${encode(value)}`);
    }

    return result;
}

export const QueryString = Object.freeze({
    /**
     * Generate a query string from an object.
     *
     * @param params Object containing the keys and values to be used.
     * @param traditional Boolean Use the old URI template standard (RFC6570)
     * @returns The generated query string, excluding leading '?'.
     */
    build(params: Object, traditional?: boolean): string {
        let pairs: string[] = [];
        const keys = Object.keys(params || {}).sort();

        for (let i = 0, len = keys.length; i < len; i++) {
            let key = keys[i];
            pairs = pairs.concat(buildParam(key, params[key], traditional));
        }

        if (pairs.length === 0) {
            return "";
        }

        return pairs.join("&");
    },
});
