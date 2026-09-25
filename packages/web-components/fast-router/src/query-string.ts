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
                const arrayKey =
                    key +
                    "[" +
                    (typeof value[i] === "object" && value[i] !== null ? i : "") +
                    "]";
                result = result.concat(buildParam(arrayKey, value[i]));
            }
        }
    } else if (typeof value === "object" && !traditional) {
        for (const propertyName in value) {
            result = result.concat(
                buildParam(key + "[" + propertyName + "]", value[propertyName])
            );
        }
    } else {
        result.push(`${encodeKey(key)}=${encode(value)}`);
    }

    return result;
}

function processScalarParam(existedParam: any, value: string): any {
    if (Array.isArray(existedParam)) {
        // value is already an array, so push on the next value.
        existedParam.push(value);
        return existedParam;
    }

    if (existedParam !== undefined) {
        // value isn't an array, but since a second value has been specified,
        // convert value into an array.
        return [existedParam, value];
    }

    // value is a scalar.
    return value;
}

function parseComplexParam(queryParams: Object, keys: string[], value: any): void {
    let currentParams: any = queryParams;
    const keysLastIndex = keys.length - 1;

    for (let j = 0; j <= keysLastIndex; j++) {
        const key = keys[j] === "" ? currentParams.length : keys[j];
        if (j < keysLastIndex) {
            // The value has to be an array or a false value
            // It can happen that the value is no array if the key was repeated with traditional style like `list=1&list[]=2`
            const prevValue =
                !currentParams[key] || typeof currentParams[key] === "object"
                    ? currentParams[key]
                    : [currentParams[key]];
            currentParams = currentParams[key] =
                prevValue || (isNaN(keys[j + 1] as any) ? {} : []);
        } else {
            currentParams = currentParams[key] = value;
        }
    }
}

/**
 * @beta
 */
export const QueryString = Object.freeze({
    get current() {
        return location.search;
    },

    /**
     * Generate a query string from an object.
     *
     * @param params - Object containing the keys and values to be used.
     * @param traditional - Boolean Use the old URI template standard (RFC6570)
     * @returns The generated query string, excluding leading '?'.
     */
    build(params: Record<string, string>, traditional?: boolean): string {
        let pairs: string[] = [];
        const keys = Object.keys(params || {}).sort();

        for (let i = 0, len = keys.length; i < len; i++) {
            const key = keys[i];
            pairs = pairs.concat(buildParam(key, params[key], traditional));
        }

        if (pairs.length === 0) {
            return "";
        }

        return pairs.join("&");
    },

    /**
     * Separate the query string from the path and returns the two parts.
     * @param path - The path to separate.
     */
    separate(path: string): Readonly<{ path: string; queryString: string }> {
        const queryStart = path.indexOf("?");
        let queryString = "";

        if (queryStart !== -1) {
            queryString = path.substr(queryStart + 1, path.length);
            path = path.substr(0, queryStart);
        }

        return {
            path,
            queryString,
        };
    },

    /**
     * Parse a query string.
     *
     * @param queryString - The query string to parse.
     * @returns Object with keys and values mapped from the query string.
     */
    parse(queryString: string): Readonly<Record<string, string>> {
        const queryParams = {} as Record<string, any>;
        if (!queryString || typeof queryString !== "string") {
            return queryParams;
        }

        let query = queryString;
        if (query.charAt(0) === "?") {
            query = query.substr(1);
        }

        const pairs = query.replace(/\+/g, " ").split("&");

        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split("=");
            const key = decodeURIComponent(pair[0]);
            if (!key) {
                continue;
            }
            //split object key into its parts
            let keys = key.split("][");
            let keysLastIndex = keys.length - 1;

            // If the first keys part contains [ and the last ends with ], then []
            // are correctly balanced, split key to parts
            //Else it's basic key
            if (/\[/.test(keys[0]) && /\]$/.test(keys[keysLastIndex])) {
                keys[keysLastIndex] = keys[keysLastIndex].replace(/\]$/, "");
                keys = keys.shift()!.split("[").concat(keys);
                keysLastIndex = keys.length - 1;
            } else {
                keysLastIndex = 0;
            }

            if (pair.length >= 2) {
                const value = pair[1] ? decodeURIComponent(pair[1]) : "";

                if (keysLastIndex) {
                    parseComplexParam(queryParams, keys, value);
                } else {
                    queryParams[key] = processScalarParam(queryParams[key], value);
                }
            } else {
                queryParams[key] = true;
            }
        }

        return queryParams;
    },
});
