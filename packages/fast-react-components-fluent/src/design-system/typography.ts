import { fontWeight } from "./fonts";
import { toPx } from "../utilities";

/**
 * The type ramp item config
 */
export interface ITypeRampItemConfig {
    fontSize: number;
    lineHeight: number;
}

/**
 * The base config affects all viewports while the optional large config
 * should be implemented on larger viewports.
 */
export interface ITypeRampItem {
    large?: ITypeRampItemConfig;
    base: ITypeRampItemConfig;
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
        large: {
            fontSize: 62,
            lineHeight: 72
        },
        base: {
            fontSize: 46,
            lineHeight: 60
        }
    },
    t2: {
        large: {
            fontSize: 46,
            lineHeight: 56
        },
        base: {
            fontSize: 34,
            lineHeight: 48
        }
    },
    t3: {
        large: {
            fontSize: 34,
            lineHeight: 48
        },
        base: {
            fontSize: 26,
            lineHeight: 40
        }
    },
    t4: {
        large: {
            fontSize: 24,
            lineHeight: 36
        },
        base: {
            fontSize: 20,
            lineHeight: 32
        }
    },
    t5: {
        large: {
            fontSize: 20,
            lineHeight: 28
        },
        base: {
            fontSize: 18,
            lineHeight: 28
        }
    },
    t6: {
        large: {
            fontSize: 18,
            lineHeight: 28
        },
        base: {
            fontSize: 16,
            lineHeight: 28
        }
    },
    t7: {
        base: {
            fontSize: 15,
            lineHeight: 24
        }
    },
    t8: {
        large: {
            fontSize: 13,
            lineHeight: 20
        },
        base: {
            fontSize: 12,
            lineHeight: 20
        }
    },
    t9: {
        large: {
            fontSize: 11,
            lineHeight: 20
        },
        base: {
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
    large?: typographyItemConfig;
    base: typographyItemConfig;
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
        large: (): ITypographyItemConfig => {
            return {
                padding: "38px 0 6px",
                fontWeight: fontWeight.bold,
                letterSpacing: "-0.01em",
                fontSize: toPx(typeRamp.t1.large.fontSize),
                lineHeight: toPx(typeRamp.t1.large.lineHeight)
            };
        },
        base: (): ITypographyItemConfig => {
            return {
                padding: "37px 0 6px",
                fontSize: toPx(typeRamp.t1.base.fontSize),
                lineHeight: toPx(typeRamp.t1.base.lineHeight)
            };
        }
    },
    h2: {
        large: (): ITypographyItemConfig => {
            return {
                padding: "37px 0 3px",
                fontWeight: fontWeight.bold,
                letterSpacing: "-0.01em",
                fontSize: toPx(typeRamp.t2.large.fontSize),
                lineHeight: toPx(typeRamp.t2.large.lineHeight)
            };
        },
        base: (): ITypographyItemConfig => {
            return {
                padding: "38px 0 2px",
                fontSize: toPx(typeRamp.t2.base.fontSize),
                lineHeight: toPx(typeRamp.t2.base.lineHeight)
            };
        }
    },
    h3: {
        base: (): ITypographyItemConfig => {
            return {
                padding: "38px 0 2px",
                fontWeight: fontWeight.bold,
                fontSize: toPx(typeRamp.t3.base.fontSize),
                lineHeight: toPx(typeRamp.t3.base.lineHeight)
            };
        }
    },
    h4: {
        base: (): ITypographyItemConfig => {
            return {
                padding: "36px 0 4px",
                fontWeight: fontWeight.bold,
                fontSize: toPx(typeRamp.t4.base.fontSize),
                lineHeight: toPx(typeRamp.t4.base.lineHeight)
            };
        }
    },
    h5: {
        large: (): ITypographyItemConfig => {
            return {
                padding: "35px 0 5px",
                fontWeight: fontWeight.bold,
                fontSize: toPx(typeRamp.t5.large.fontSize),
                lineHeight: toPx(typeRamp.t5.large.lineHeight)
            };
        },
        base: (): ITypographyItemConfig => {
            return {
                padding: "37px 0 3px",
                fontSize: toPx(typeRamp.t5.base.fontSize),
                lineHeight: toPx(typeRamp.t5.base.lineHeight)
            };
        }
    },
    h6: {
        large: (): ITypographyItemConfig => {
            return {
                padding: "37px 0 3px",
                fontWeight: fontWeight.bold,
                fontSize: toPx(typeRamp.t6.large.fontSize),
                lineHeight: toPx(typeRamp.t6.large.lineHeight)
            };
        },
        base: (): ITypographyItemConfig => {
            return {
                padding: "39px 0 1px",
                fontSize: toPx(typeRamp.t6.base.fontSize),
                lineHeight: toPx(typeRamp.t6.base.lineHeight)
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
        large: (): ITypographyItemConfig => {
            return {
                padding: "12px 0 2px",
                fontWeight: fontWeight.light,
                fontSize: toPx(typeRamp.t3.large.fontSize),
                lineHeight: toPx(typeRamp.t3.large.lineHeight)
            };
        },
        base: (): ITypographyItemConfig => {
            return {
                padding: "9px 0 3px",
                fontSize: toPx(typeRamp.t3.large.fontSize),
                lineHeight: toPx(typeRamp.t3.large.lineHeight)
            };
        },
    },
    sh2: {
        large: (): ITypographyItemConfig => {
            return {
                padding: "4px 0 8px",
                fontWeight: fontWeight.semilight,
                fontSize: toPx(typeRamp.t4.large.fontSize),
                lineHeight: toPx(typeRamp.t4.large.lineHeight)
            };
        },
        base: (): ITypographyItemConfig => {
            return {
                padding: "8px 0 4px",
                fontSize: toPx(typeRamp.t4.base.fontSize),
                lineHeight: toPx(typeRamp.t4.base.lineHeight)
            };
        }
    },
    sh3: {
        large: (): ITypographyItemConfig => {
            return {
                padding: "8px 0 4px",
                fontWeight: fontWeight.normal,
                fontSize: toPx(typeRamp.t5.large.fontSize),
                lineHeight: toPx(typeRamp.t5.large.lineHeight)
            };
        },
        base: (): ITypographyItemConfig => {
            return {
                padding: "4px 0 4px",
                fontSize: toPx(typeRamp.t5.base.fontSize),
                lineHeight: toPx(typeRamp.t5.base.lineHeight)
            };
        }
    },
    sh4: {
        large: (): ITypographyItemConfig => {
            return {
                padding: "9px 0 3px",
                fontWeight: fontWeight.normal,
                fontSize: toPx(typeRamp.t6.large.fontSize),
                lineHeight: toPx(typeRamp.t6.large.lineHeight)
            };
        },
        base: (): ITypographyItemConfig => {
            return {
                padding: "7px 0 5px",
                fontSize: toPx(typeRamp.t6.base.fontSize),
                lineHeight: toPx(typeRamp.t6.base.lineHeight)
            };
        }
    },
    sh5: {
        base: (): ITypographyItemConfig => {
            return {
                padding: "8px 0 0",
                fontWeight: fontWeight.normal,
                fontSize: toPx(typeRamp.t7.base.fontSize),
                lineHeight: toPx(typeRamp.t7.base.lineHeight)
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
        base: (): ITypographyItemConfig => {
            return {
                padding: "24px 0 4px",
                fontWeight: fontWeight.semilight,
                fontSize: toPx(typeRamp.t5.base.fontSize),
                lineHeight: toPx(typeRamp.t5.base.lineHeight)
            };
        }
    },
    p2: {
        large: (): ITypographyItemConfig => {
            return {
                padding: "25px 0 3px",
                fontWeight: fontWeight.normal,
                fontSize: toPx(typeRamp.t6.large.fontSize),
                lineHeight: toPx(typeRamp.t6.large.lineHeight)
            };
        },
        base: (): ITypographyItemConfig => {
            return {
                padding: "27px 0 1px",
                fontSize: toPx(typeRamp.t6.base.fontSize),
                lineHeight: toPx(typeRamp.t6.base.lineHeight)
            };
        }
    },
    p3: {
        base: (): ITypographyItemConfig => {
            return {
                padding: "24px 0 0",
                fontWeight: fontWeight.normal,
                fontSize: toPx(typeRamp.t7.base.fontSize),
                lineHeight: toPx(typeRamp.t7.base.lineHeight)
            };
        }
    },
    p4: {
        base: (): ITypographyItemConfig => {
            return {
                padding: "12px 0 0",
                fontWeight: fontWeight.normal,
                fontSize: toPx(typeRamp.t7.base.fontSize),
                lineHeight: toPx(typeRamp.t7.base.lineHeight)
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
        base: (): ITypographyItemConfig => {
            return {
                padding: "3px 0 1px",
                fontWeight: fontWeight.normal,
                fontSize: toPx(typeRamp.t8.base.fontSize),
                lineHeight: toPx(typeRamp.t8.base.lineHeight)
            };
        }
    },
    c2: {
        large: (): ITypographyItemConfig => {
            return {
                padding: "4px 0 4px",
                fontWeight: fontWeight.normal,
                fontSize: toPx(typeRamp.t9.large.fontSize),
                lineHeight: toPx(typeRamp.t9.large.lineHeight)
            };
        },
        base: (): ITypographyItemConfig => {
            return {
                padding: "2px 0 2px",
                fontSize: toPx(typeRamp.t9.large.fontSize),
                lineHeight: toPx(typeRamp.t9.large.lineHeight)
            };
        }
    }
};
