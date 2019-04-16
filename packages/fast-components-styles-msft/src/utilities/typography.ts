import { toPx } from "@microsoft/fast-jss-utilities";
import { CSSRules } from "@microsoft/fast-jss-manager";
import {
    DesignSystem,
    DesignSystemResolver,
    ensureDesignSystemDefaults,
} from "../design-system";
import { getOffsetForDensityCategory } from "./density";
import { clamp } from "lodash-es";

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
export type TypeRampItem = TypeRampItemConfig;

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
        fontSize: 60,
        lineHeight: 72,
    },
    t2: {
        fontSize: 46,
        lineHeight: 56,
    },
    t3: {
        fontSize: 34,
        lineHeight: 44,
    },
    t4: {
        fontSize: 28,
        lineHeight: 36,
    },
    t5: {
        fontSize: 20,
        lineHeight: 28,
    },
    t6: {
        fontSize: 16,
        lineHeight: 24,
    },
    t7: {
        fontSize: 14,
        lineHeight: 20,
    },
    t8: {
        fontSize: 12,
        lineHeight: 16,
    },
    t9: {
        fontSize: 10,
        lineHeight: 16,
    },
};

/**
 * Scales a typeramp ID by density
 */
function scaleTypeRampId(key: keyof TypeRamp): DesignSystemResolver<keyof TypeRamp> {
    return ensureDesignSystemDefaults(
        (designSystem: DesignSystem): keyof TypeRamp => {
            const typeConfigNumber: number = parseInt(key.replace("t", ""), 10);
            const densityOffset: number = getOffsetForDensityCategory(-1, 1)(
                designSystem
            );
            const size: number = clamp(typeConfigNumber - densityOffset, 1, 9);
            return sanitizeTypeRampId("t".concat(size.toString()) as keyof TypeRamp);
        }
    );
}

/*
 * Ensures that a TypeRamp key is in the TypeRamp
 */
function sanitizeTypeRampId(key: keyof TypeRamp): keyof TypeRamp {
    return typeRamp.hasOwnProperty(key) ? key : "t7";
}

/**
 * Takes a param of type ramp key (string) and returns a type ramp configuration
 * @deprecated - please use applyTypeRamp
 */
export function applyTypeRampConfig(typeConfig: keyof TypeRamp): CSSRules<DesignSystem> {
    return applyTypeRamp(typeConfig);
}

/**
 * Retrieves the font-size from a TypeRamp ID
 */
export function getFontSize(key: keyof TypeRamp): number {
    return typeRamp[sanitizeTypeRampId(key)].fontSize;
}

/**
 * Retrieves the line-height from a TypeRamp ID
 */
export function getLineHeight(key: keyof TypeRamp): number {
    return typeRamp[sanitizeTypeRampId(key)].lineHeight;
}

/**
 * Retrieves the formatted font-size from a TypeRamp ID
 */
export function applyFontSize(key: keyof TypeRamp): string {
    return toPx(typeRamp[sanitizeTypeRampId(key)].fontSize);
}

/**
 * Retrieves the formatted line-height from a TypeRamp ID
 */
export function applyLineHeight(key: keyof TypeRamp): string {
    return toPx(typeRamp[sanitizeTypeRampId(key)].lineHeight);
}

/**
 * Retrieves the font-size from a TypeRamp ID, scaled with the design-system density
 */
export function getScaledFontSize(key: keyof TypeRamp): DesignSystemResolver<number> {
    return (designSystem: DesignSystem): number => {
        return getFontSize(scaleTypeRampId(key)(designSystem));
    };
}

/**
 * Retrieves the line-height from a TypeRamp ID, scaled with the design-system density
 */
export function getScaledLineHeight(key: keyof TypeRamp): DesignSystemResolver<number> {
    return (designSystem: DesignSystem): number => {
        return getLineHeight(scaleTypeRampId(key)(designSystem));
    };
}

/**
 * Retrieves the formatted font-size from a TypeRamp ID, scaled with the design-system density
 */
export function applyScaledFontSize(key: keyof TypeRamp): DesignSystemResolver<string> {
    return (designSystem: DesignSystem): string => {
        return applyFontSize(scaleTypeRampId(key)(designSystem));
    };
}

/**
 * Retrieves the formatted line-height from a TypeRamp ID, scaled with the design-system density
 */
export function applyScaledLineHeight(key: keyof TypeRamp): DesignSystemResolver<string> {
    return (designSystem: DesignSystem): string => {
        return applyLineHeight(scaleTypeRampId(key)(designSystem));
    };
}

/**
 * Applies font size and line-height properties from the typeramp
 */
export function applyTypeRamp(typeConfig: keyof TypeRamp): CSSRules<DesignSystem> {
    return {
        fontSize: toPx(typeRamp[typeConfig].fontSize),
        lineHeight: toPx(typeRamp[typeConfig].lineHeight),
    };
}

/**
 * Applies font size and line-height from the type ramp, scaled with design system density
 */
export function applyScaledTypeRamp(key: keyof TypeRamp): CSSRules<DesignSystem> {
    return {
        fontSize: applyScaledFontSize(key),
        lineHeight: applyScaledLineHeight(key),
    };
}
