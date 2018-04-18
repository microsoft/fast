import { isEmptyObject } from "./object";

/**
 * Recurse over an object and copies all keys with primitive values over to a new object
 */
function getStaticStyles<T>(styleObject: T): T {
    const clone: Partial<T> = {};

    for (const key in styleObject) {
        if (styleObject.hasOwnProperty(key)) {
            switch (typeof styleObject[key]) {
                case "string":
                case "number":
                case "boolean":
                    clone[key] = styleObject[key];
                    break;

                case "object":
                    if (styleObject[key] !== null) {
                        const staticStyles: T[keyof T] = getStaticStyles(styleObject[key]);

                        if (staticStyles) {
                            clone[key] = staticStyles;
                        }
                    }
            }
        }
    }

    if (Object.keys(clone).length) {
        return clone as T;
    }
}

export default getStaticStyles;
