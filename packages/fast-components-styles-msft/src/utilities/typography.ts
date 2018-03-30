import { fontWeight } from "./fonts";
import { toPx } from "./units";

/**
 * The type ramp item config
 */
export interface ITypeRampItemConfig {
    fontSize: number;
    lineHeight: number;
}

/**
 * The vp1 config affects all viewports while the optional vp3 config
 * should be implemented on vp3r viewports.
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
    fontWeight?: number;
    letterSpacing?: string;
    padding: string;
    fontSize: string;
    lineHeight: string;
}

export type typographyItemConfig = () => ITypographyItemConfig;

export interface ITypographyItem {
    vp3?: typographyItemConfig;
    vp1: typographyItemConfig;
}

/**
 * The heading configuration
 */

export interface IHeading {
    h1: ITypographyItem;
    h2: ITypographyItem;
    h3: ITypographyItem;
    h4: ITypographyItem;
    h5: ITypographyItem;
    h6: ITypographyItem;
}

export const heading: IHeading = {
    h1: {
        vp3: (): ITypographyItemConfig => {
            return {
                fontSize: toPx(typeRamp.t1.vp3.fontSize),
                lineHeight: toPx(typeRamp.t1.vp3.lineHeight),
                padding: "38px 0 6px"
            };
        },
        vp1: (): ITypographyItemConfig => {
            return {
                fontWeight: fontWeight.bold,
                fontSize: toPx(typeRamp.t1.vp1.fontSize),
                letterSpacing: "-0.01em",
                lineHeight: toPx(typeRamp.t1.vp1.lineHeight),
                padding: "37px 0 6px",
            };
        }
    },
    h2: {
        vp3: (): ITypographyItemConfig => {
            return {
                fontSize: toPx(typeRamp.t2.vp3.fontSize),
                lineHeight: toPx(typeRamp.t2.vp3.lineHeight),
                padding: "37px 0 3px",
            };
        },
        vp1: (): ITypographyItemConfig => {
            return {
                fontWeight: fontWeight.bold,
                fontSize: toPx(typeRamp.t2.vp1.fontSize),
                letterSpacing: "-0.01em",
                lineHeight: toPx(typeRamp.t2.vp1.lineHeight),
                padding: "38px 0 2px",
            };
        }
    },
    h3: {
        vp1: (): ITypographyItemConfig => {
            return {
                fontWeight: fontWeight.bold,
                fontSize: toPx(typeRamp.t3.vp1.fontSize),
                lineHeight: toPx(typeRamp.t3.vp1.lineHeight),
                padding: "38px 0 2px"
            };
        }
    },
    h4: {
        vp1: (): ITypographyItemConfig => {
            return {
                fontWeight: fontWeight.bold,
                fontSize: toPx(typeRamp.t4.vp1.fontSize),
                lineHeight: toPx(typeRamp.t4.vp1.lineHeight),
                padding: "36px 0 4px"
            };
        }
    },
    h5: {
        vp3: (): ITypographyItemConfig => {
            return {
                fontSize: toPx(typeRamp.t5.vp3.fontSize),
                lineHeight: toPx(typeRamp.t5.vp3.lineHeight),
                padding: "35px 0 5px"
            };
        },
        vp1: (): ITypographyItemConfig => {
            return {
                fontWeight: fontWeight.bold,
                fontSize: toPx(typeRamp.t5.vp1.fontSize),
                lineHeight: toPx(typeRamp.t5.vp1.lineHeight),
                padding: "37px 0 3px"
            };
        }
    },
    h6: {
        vp3: (): ITypographyItemConfig => {
            return {
                fontSize: toPx(typeRamp.t6.vp3.fontSize),
                lineHeight: toPx(typeRamp.t6.vp3.lineHeight),
                padding: "37px 0 3px",
            };
        },
        vp1: (): ITypographyItemConfig => {
            return {
                fontSize: toPx(typeRamp.t6.vp1.fontSize),
                fontWeight: fontWeight.bold,
                lineHeight: toPx(typeRamp.t6.vp1.lineHeight),
                padding: "39px 0 1px"
            };
        }
    }
};

/**
 * The subheading configuration
 */

export interface ISubheading {
    sh1: ITypographyItem;
    sh2: ITypographyItem;
    sh3: ITypographyItem;
    sh4: ITypographyItem;
    sh5: ITypographyItem;
}

export const subheading: ISubheading = {
    sh1: {
        vp3: (): ITypographyItemConfig => {
            return {
                fontSize: toPx(typeRamp.t3.vp3.fontSize),
                lineHeight: toPx(typeRamp.t3.vp3.lineHeight),
                padding: "12px 0 2px"
            };
        },
        vp1: (): ITypographyItemConfig => {
            return {
                fontSize: toPx(typeRamp.t3.vp3.fontSize),
                fontWeight: fontWeight.light,
                lineHeight: toPx(typeRamp.t3.vp3.lineHeight),
                padding: "9px 0 3px"
            };
        },
    },
    sh2: {
        vp3: (): ITypographyItemConfig => {
            return {
                fontSize: toPx(typeRamp.t4.vp3.fontSize),
                lineHeight: toPx(typeRamp.t4.vp3.lineHeight),
                padding: "4px 0 8px"
            };
        },
        vp1: (): ITypographyItemConfig => {
            return {
                fontWeight: fontWeight.semilight,
                fontSize: toPx(typeRamp.t4.vp1.fontSize),
                lineHeight: toPx(typeRamp.t4.vp1.lineHeight),
                padding: "8px 0 4px"
            };
        }
    },
    sh3: {
        vp3: (): ITypographyItemConfig => {
            return {
                fontSize: toPx(typeRamp.t5.vp3.fontSize),
                lineHeight: toPx(typeRamp.t5.vp3.lineHeight),
                padding: "8px 0 4px"
            };
        },
        vp1: (): ITypographyItemConfig => {
            return {
                fontWeight: fontWeight.normal,
                fontSize: toPx(typeRamp.t5.vp1.fontSize),
                lineHeight: toPx(typeRamp.t5.vp1.lineHeight),
                padding: "4px 0 4px"
            };
        }
    },
    sh4: {
        vp3: (): ITypographyItemConfig => {
            return {
                fontSize: toPx(typeRamp.t6.vp3.fontSize),
                lineHeight: toPx(typeRamp.t6.vp3.lineHeight),
                padding: "9px 0 3px"
            };
        },
        vp1: (): ITypographyItemConfig => {
            return {
                fontWeight: fontWeight.normal,
                fontSize: toPx(typeRamp.t6.vp1.fontSize),
                lineHeight: toPx(typeRamp.t6.vp1.lineHeight),
                padding: "7px 0 5px"
            };
        }
    },
    sh5: {
        vp1: (): ITypographyItemConfig => {
            return {
                fontWeight: fontWeight.normal,
                fontSize: toPx(typeRamp.t7.vp1.fontSize),
                lineHeight: toPx(typeRamp.t7.vp1.lineHeight),
                padding: "8px 0 0"
            };
        }
    }
};

/**
 * The paragraph configuration
 */

export interface IParagraph {
    p1: ITypographyItem;
    p2: ITypographyItem;
    p3: ITypographyItem;
    p4: ITypographyItem;
}

export const paragraph: IParagraph = {
    p1: {
        vp1: (): ITypographyItemConfig => {
            return {
                fontWeight: fontWeight.semilight,
                fontSize: toPx(typeRamp.t5.vp1.fontSize),
                lineHeight: toPx(typeRamp.t5.vp1.lineHeight),
                padding: "24px 0 4px"
            };
        }
    },
    p2: {
        vp3: (): ITypographyItemConfig => {
            return {
                fontSize: toPx(typeRamp.t6.vp3.fontSize),
                lineHeight: toPx(typeRamp.t6.vp3.lineHeight),
                padding: "25px 0 3px"
            };
        },
        vp1: (): ITypographyItemConfig => {
            return {
                fontWeight: fontWeight.normal,
                fontSize: toPx(typeRamp.t6.vp1.fontSize),
                lineHeight: toPx(typeRamp.t6.vp1.lineHeight),
                padding: "27px 0 1px"
            };
        }
    },
    p3: {
        vp1: (): ITypographyItemConfig => {
            return {
                fontWeight: fontWeight.normal,
                fontSize: toPx(typeRamp.t7.vp1.fontSize),
                lineHeight: toPx(typeRamp.t7.vp1.lineHeight),
                padding: "24px 0 0"
            };
        }
    },
    p4: {
        vp1: (): ITypographyItemConfig => {
            return {
                fontWeight: fontWeight.normal,
                fontSize: toPx(typeRamp.t7.vp1.fontSize),
                lineHeight: toPx(typeRamp.t7.vp1.lineHeight),
                padding: "12px 0 0"
            };
        }
    }
};

/**
 * The caption configuration
 */

export interface ICaption {
    c1: ITypographyItem;
    c2: ITypographyItem;
}

export const caption: ICaption = {
    c1: {
        vp1: (): ITypographyItemConfig => {
            return {
                fontWeight: fontWeight.normal,
                fontSize: toPx(typeRamp.t8.vp1.fontSize),
                lineHeight: toPx(typeRamp.t8.vp1.lineHeight),
                padding: "3px 0 1px"
            };
        }
    },
    c2: {
        vp3: (): ITypographyItemConfig => {
            return {
                fontSize: toPx(typeRamp.t9.vp3.fontSize),
                lineHeight: toPx(typeRamp.t9.vp3.lineHeight),
                padding: "4px 0 4px"
            };
        },
        vp1: (): ITypographyItemConfig => {
            return {
                fontWeight: fontWeight.normal,
                fontSize: toPx(typeRamp.t9.vp3.fontSize),
                lineHeight: toPx(typeRamp.t9.vp3.lineHeight),
                padding: "2px 0 2px"
            };
        }
    }
};
