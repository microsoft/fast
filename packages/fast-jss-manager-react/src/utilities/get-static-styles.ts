import { isEmptyObject } from "./object";

/**
 * Recurse over an object and coppies all keys with primitive values over to a new object
 * TODO: Write tests and perhaphs abstract this a bit. It could be a general purpose function
 * "exclude" which accepts two objects and returns a new object with only the keys that aren't shared.
 */
export interface IGetStaticStyles {
    [key: string]: any;
}

function getStaticStyles(styleObject: IGetStaticStyles): IGetStaticStyles | void {
    const clone: IGetStaticStyles = {};

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
                        const staticStyles: IGetStaticStyles | void = getStaticStyles(styleObject[key]);

                        if (staticStyles) {
                            clone[key] = staticStyles;
                        }
                    }
            }
        }
    }

    if (Object.keys(clone).length) {
        return clone;
    }
}

export default getStaticStyles;
