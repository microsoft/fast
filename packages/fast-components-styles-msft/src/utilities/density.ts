import { applyTypeRampConfig, TypeRamp, typeRamp } from "../utilities/typography";
import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { CSSRules } from "@microsoft/fast-jss-manager";
import { toPx } from "@microsoft/fast-jss-utilities";

/**
 * Returns the type ramp adjustment from the default setting. Collapses
 * the fact that a single type size is used for multiple densities.
 *
 * @param designSystem The design system config
 */
export function densityToTypeOffset(designSystem: DesignSystem): number {
    const offset: number =
        designSystem.density >= 2 ? 1 : designSystem.density <= -2 ? -1 : 0;
    return offset;
}

/**
 * Returns the component height formatted in the provided unit or px by default.
 *
 * @param lines The logical number of lines the component takes, typically 1.
 * @param unit The unit of measurement; px by default.
 */
export function height(
    lines: number = 1,
    unit?: string
): (config: DesignSystem) => string {
    return (config: DesignSystem): string => {
        const designSystem: DesignSystem = withDesignSystemDefaults(config);
        const value: number = heightNumber(lines)(designSystem);
        return typeof unit === "string" ? `${value}${unit}` : toPx(value);
    };
}

/**
 * Returns the component height as a number.
 *
 * @param lines The logical number of lines the component takes, typically 1.
 */
export function heightNumber(lines: number): (config: DesignSystem) => number {
    return (config: DesignSystem): number => {
        const designSystem: DesignSystem = withDesignSystemDefaults(config);
        const value: number =
            (designSystem.defaultHeightMultiplier + designSystem.density) *
            designSystem.designUnit *
            lines;
        return value;
    };
}

export function minHeight(lines: number = 1): (config: DesignSystem) => string {
    return (config: DesignSystem): string => {
        const designSystem: DesignSystem = withDesignSystemDefaults(config);
        const value: number =
            (designSystem.defaultHeightMultiplier - 3) * designSystem.designUnit * lines;
        return toPx(value);
    };
}

export function maxHeight(lines: number = 1): (config: DesignSystem) => string {
    return (config: DesignSystem): string => {
        const designSystem: DesignSystem = withDesignSystemDefaults(config);
        const value: number =
            (designSystem.defaultHeightMultiplier + 3) * designSystem.designUnit * lines;
        return toPx(value);
    };
}

/**
 * Returns the standard horizontal padding for text and icons formatted in the provided unit or px by default.
 *
 * @param minusBorder Any border that should be removed from the overall content padding.
 * @param unit The unit of measurement; px by default.
 */
export function padding(
    minusBorder: number = 0,
    unit?: string
): (config: DesignSystem) => string {
    return (config: DesignSystem): string => {
        const designSystem: DesignSystem = withDesignSystemDefaults(config);
        const offset: number = densityToTypeOffset(designSystem);
        const value: number = paddingNumber(minusBorder)(designSystem);
        return typeof unit === "string" ? `${value}${unit}` : toPx(value);
    };
}

/**
 * Returns the standard horizontal padding for text and icons as a number.
 *
 * @param minusBorder Any border that should be removed from the overall content padding.
 */
export function paddingNumber(minusBorder: number = 0): (config: DesignSystem) => number {
    return (config: DesignSystem): number => {
        const designSystem: DesignSystem = withDesignSystemDefaults(config);
        const offset: number = densityToTypeOffset(designSystem);
        const value: number =
            (designSystem.defaultPaddingMultiplier + offset) * designSystem.designUnit -
            minusBorder;
        return value;
    };
}

/**
 * Adds the font size and line height attributes for the type ramp according to the design system config.
 *
 * @param config The design system config.
 * @param offset Manually adjusts the density for smaller or larger components.
 */
export function applyFontSize(
    config: DesignSystem,
    offset: number = 0
): CSSRules<DesignSystem> {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const densityOffset: number = densityToTypeOffset(designSystem);
    const rampInt: number = parseInt(
        designSystem.defaultTypeRampSize.replace("t", ""),
        10
    );
    const size: number = rampInt - densityOffset - offset;
    const key: keyof TypeRamp | string = "t" + size;

    if (key in typeRamp) {
        return applyTypeRampConfig(key as keyof TypeRamp);
    } else {
        return applyTypeRampConfig("t7");
    }
}

/**
 * @deprecated Use height instead.
 * @param value
 * @param unit
 */
export function density(value: number, unit?: string): (config: DesignSystem) => string {
    return (config: DesignSystem): string => {
        const designSystem: DesignSystem = withDesignSystemDefaults(config);
        const augmented: number = value * designSystem.density;
        return typeof unit === "string" ? `${augmented}${unit}` : toPx(augmented);
    };
}
