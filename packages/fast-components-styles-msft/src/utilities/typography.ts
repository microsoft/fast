import { breakpoints } from "../utilities/breakpoints";
import { toPx } from "./units";
import { ICSSRules } from "@microsoft/fast-jss-manager";

/**
 * The type ramp item config
 */
export interface ITypeRampItemConfig {
    fontSize: number;
    lineHeight: number;
}

/**
 * The vp1 config affects all viewports while the optional vp3 config
 * should be implemented on vp3 viewports.
 */
export interface ITypeRampItem {
    vp3?: ITypeRampItemConfig;
    vp1: ITypeRampItemConfig;
}

/**
 * The type ramp which covers all type configurations used
 * in typographic elements
 */
export interface ITypeRamp {
    t1: ITypeRampItem;
    t2: ITypeRampItem;
    t3: ITypeRampItem;
    t4: ITypeRampItem;
    t5: ITypeRampItem;
    t6: ITypeRampItem;
    t7: ITypeRampItem;
    t8: ITypeRampItem;
    t9: ITypeRampItem;
}

/**
 * The type ramp configuration
 */
export const typeRamp: ITypeRamp = {
    t1: {
        vp3: {
            fontSize: 62,
            lineHeight: 72
        },
        vp1: {
            fontSize: 46,
            lineHeight: 60
        }
    },
    t2: {
        vp3: {
            fontSize: 46,
            lineHeight: 56
        },
        vp1: {
            fontSize: 34,
            lineHeight: 48
        }
    },
    t3: {
        vp3: {
            fontSize: 34,
            lineHeight: 48
        },
        vp1: {
            fontSize: 26,
            lineHeight: 40
        }
    },
    t4: {
        vp3: {
            fontSize: 24,
            lineHeight: 36
        },
        vp1: {
            fontSize: 20,
            lineHeight: 32
        }
    },
    t5: {
        vp3: {
            fontSize: 20,
            lineHeight: 28
        },
        vp1: {
            fontSize: 18,
            lineHeight: 28
        }
    },
    t6: {
        vp3: {
            fontSize: 18,
            lineHeight: 28
        },
        vp1: {
            fontSize: 16,
            lineHeight: 28
        }
    },
    t7: {
        vp1: {
            fontSize: 15,
            lineHeight: 24
        }
    },
    t8: {
        vp3: {
            fontSize: 13,
            lineHeight: 20
        },
        vp1: {
            fontSize: 12,
            lineHeight: 20
        }
    },
    t9: {
        vp3: {
            fontSize: 11,
            lineHeight: 20
        },
        vp1: {
            fontSize: 10,
            lineHeight: 20
        }
    }
};

/**
 * The typographic items full JSS configuration
 */
export interface ITypographyItemConfig {
    fontSize: string;
    lineHeight: string;
}

export interface ITypographyItem {
    [key: string]: ITypographyItemConfig | object;
}

/**
 * Takes a param of type ramp key (string) and returns a type ramp configuration
 */
export function applyTypeRampConfig(typeConfig: keyof ITypeRamp): ICSSRules<ITypographyItem> {
    const baseType: ITypographyItem = {
        [`@media only screen and (min-width: ${breakpoints.vp1}px)`]: {
            fontSize: toPx(typeRamp[typeConfig].vp1.fontSize),
            lineHeight: toPx(typeRamp[typeConfig].vp1.lineHeight)
        }
    };

    if (typeRamp[typeConfig].vp3) {
        const responsiveType: ITypographyItem = {
            [`@media only screen and (min-width: ${breakpoints.vp3}px)`]: {
                fontSize: toPx(typeRamp[typeConfig].vp3.fontSize),
                lineHeight: toPx(typeRamp[typeConfig].vp3.lineHeight)
            }
        };

        return Object.assign({}, baseType, responsiveType);
    }

    return baseType;
}
