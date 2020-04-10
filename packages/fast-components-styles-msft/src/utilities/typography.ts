import { toPx } from "@microsoft/fast-jss-utilities";
import { CSSRules } from "@microsoft/fast-jss-manager";
import { clamp } from "lodash-es";
import { DesignSystem, DesignSystemResolver } from "../design-system";
import { densityCategorySwitch } from "./density";

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
export const typeRamp: TypeRamp = [
    [60, 72], // t1
    [46, 56], // t2
    [34, 44], // t3
    [28, 36], // t4
    [20, 28], // t5
    [16, 24], // t6
    [14, 20], // t7
    [12, 16], // t8
    [10, 16], // t9
].reduce<TypeRamp>(
    (accum: TypeRamp, val: [number, number], index: number): TypeRamp =>
        Object.assign(accum, {
            [`t${index + 1}`]: { fontSize: val[0], lineHeight: val[1] },
        }),
    {} as TypeRamp
);

/*
 * Ensures that a TypeRamp key is in the TypeRamp
 */
function sanitizeTypeRampId(key: keyof TypeRamp): keyof TypeRamp {
    return typeRamp.hasOwnProperty(key) ? key : "t7";
}

/**
 * Scales a typeramp ID by density
 */
function scaleTypeRampId(key: keyof TypeRamp): DesignSystemResolver<keyof TypeRamp> {
    return (designSystem: DesignSystem): keyof TypeRamp => {
        const typeConfigNumber: number = parseInt(key.replace("t", ""), 10);
        const densityOffset: number = densityCategorySwitch(-1, 0, 1)(designSystem);
        const size: number = clamp(typeConfigNumber - densityOffset, 1, 9);
        return sanitizeTypeRampId("t".concat(size.toString()) as keyof TypeRamp);
    };
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
    return toPx(getFontSize(key));
}

/**
 * Retrieves the formatted line-height from a TypeRamp ID
 */
export function applyLineHeight(key: keyof TypeRamp): string {
    return toPx(getLineHeight(key));
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
    return (designSystem: DesignSystem): string =>
        applyLineHeight(scaleTypeRampId(key)(designSystem));
}

function applyTypeRampFactory(
    fontSizeGetter: (key: keyof TypeRamp) => string | DesignSystemResolver<string>,
    lineHeightGetter: (key: keyof TypeRamp) => string | DesignSystemResolver<string>
): (key: keyof TypeRamp) => CSSRules<DesignSystem> {
    return (key: keyof TypeRamp): CSSRules<DesignSystem> => ({
        "font-size": fontSizeGetter(key),
        "line-height": lineHeightGetter(key),
    });
}
/**
 * Applies font size and line-height properties from the typeramp
 */
export const applyTypeRamp: ReturnType<typeof applyTypeRampFactory> = applyTypeRampFactory(
    applyFontSize,
    applyLineHeight
);

/**
 * Applies font size and line-height from the type ramp, scaled with design system density
 */
export const applyScaledTypeRamp: ReturnType<typeof applyTypeRampFactory> = applyTypeRampFactory(
    applyScaledFontSize,
    applyScaledLineHeight
);

/**
 * Takes a param of type ramp key (string) and returns a type ramp configuration
 * @deprecated - please use applyTypeRamp
 */
export const applyTypeRampConfig: typeof applyTypeRamp = applyTypeRamp;
