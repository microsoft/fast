import { toPx } from "@microsoft/fast-jss-utilities";
import { applyBreakpoint, Breakpoints } from "../utilities/breakpoints";
import { KeyOfToType } from "./keyof-to-type";
import { CSSRules } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";

/**
 * The type ramp item config
 */
export interface TypeRampItemConfig {
    fontSize: number;
    lineHeight: number;
}

/**
 * The type ramp item type
 */
export type TypeRampItem = Partial<KeyOfToType<Breakpoints, TypeRampItemConfig>>;

/**
 * The type ramp which covers all type configurations used
 * in typographic elements
 */
export interface TypeRamp {
    t1: TypeRampItem;
    t2: TypeRampItem;
    t3: TypeRampItem;
    t4: TypeRampItem;
    t5: TypeRampItem;
    t6: TypeRampItem;
    t7: TypeRampItem;
    t8: TypeRampItem;
    t9: TypeRampItem;
}

/**
 * The type ramp configuration
 */
export const typeRamp: TypeRamp = {
    t1: {
        vp1: {
            fontSize: 46,
            lineHeight: 60
        },
        vp3: {
            fontSize: 62,
            lineHeight: 72
        }
    },
    t2: {
        vp1: {
            fontSize: 34,
            lineHeight: 48
        },
        vp3: {
            fontSize: 46,
            lineHeight: 56
        }
    },
    t3: {
        vp1: {
            fontSize: 26,
            lineHeight: 40
        },
        vp3: {
            fontSize: 34,
            lineHeight: 48
        }
    },
    t4: {
        vp1: {
            fontSize: 20,
            lineHeight: 32
        },
        vp3: {
            fontSize: 24,
            lineHeight: 36
        }
    },
    t5: {
        vp1: {
            fontSize: 18,
            lineHeight: 28
        },
        vp3: {
            fontSize: 20,
            lineHeight: 28
        }
    },
    t6: {
        vp1: {
            fontSize: 16,
            lineHeight: 28
        },
        vp3: {
            fontSize: 18,
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
        vp1: {
            fontSize: 12,
            lineHeight: 20
        },
        vp3: {
            fontSize: 13,
            lineHeight: 20
        }
    },
    t9: {
        vp1: {
            fontSize: 10,
            lineHeight: 20
        },
        vp3: {
            fontSize: 11,
            lineHeight: 20
        }
    }
};

/**
 * Applies a type ramp config instance based on viewport
 */
export function applyType(
    typeConfig: keyof TypeRamp,
    viewport: keyof TypeRampItem
): CSSRules<DesignSystem> {
    return {
        fontSize: toPx(typeRamp[typeConfig][viewport].fontSize),
        lineHeight: toPx(typeRamp[typeConfig][viewport].lineHeight)
    };
}

/**
 * Takes a param of type ramp key (string) and returns a type ramp configuration
 */
export function applyTypeRampConfig(typeConfig: keyof TypeRamp): CSSRules<DesignSystem> {
    return Object.keys(typeRamp[typeConfig])
        .map(
            (key: keyof TypeRampItem): CSSRules<DesignSystem> => {
                return {
                    [applyBreakpoint(key)]: applyType(typeConfig, key)
                };
            }
        )
        .reduce((accumulator: CSSRules<DesignSystem>, value: CSSRules<DesignSystem>) =>
            Object.assign({}, accumulator, value)
        );
}
