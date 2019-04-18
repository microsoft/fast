import { DesignSystem, DesignSystemResolver } from "../design-system";
import { toPx } from "@microsoft/fast-jss-utilities";
import {
    baseHeightMultiplier,
    baseHorizontalSpacingMultiplier,
    checkDesignSystemResolver,
    designUnit,
    getDesignSystemValue,
} from "../utilities/design-system";
import { debug } from "util";

export enum DensityCategory {
    compact = "compact",
    normal = "normal",
    spacious = "spacious",
}

/**
 * Returns the component height formatted in the provided unit or px by default.
 *
 * @param lines The logical number of lines the component takes, typically 1.
 * @param unit The unit of measurement; px by default.
 */
export function height(lines: number = 1, unit?: string): DesignSystemResolver<string> {
    return (designSystem: DesignSystem): string => {
        const value: number = heightNumber(lines)(designSystem);
        return typeof unit === "string" ? `${value}${unit}` : toPx(value);
    };
}

/**
 * Returns the component height as a number.
 *
 * @param lines The logical number of lines the component takes, typically 1.
 */
export function heightNumber(lines: number = 1): DesignSystemResolver<number> {
    return (designSystem: DesignSystem): number => {
        const densityValue: number = getDesignSystemValue("density")(designSystem);
        const value: number =
            (baseHeightMultiplier(designSystem) + densityValue) *
            designUnit(designSystem) *
            lines;
        return value;
    };
}

/**
 * Returns the higher-level category for the density setting.
 *
 * @param designSystem The design system config.
 */
export function getDensityCategory(designSystem: DesignSystem): DensityCategory {
    const densityValue: number = getDesignSystemValue("density")(designSystem);
    const category: DensityCategory =
        densityValue >= 2
            ? DensityCategory.spacious
            : densityValue <= -2
                ? DensityCategory.compact
                : DensityCategory.normal;
    return category;
}

/**
 * Returns a value based on the higher-level category for the density setting.
 * Used to adjust things like type size and sizing that is based on the category rather than individual density.
 *
 * @param compactValue The adjustment when the category is "compact"
 * @param normalValue The adjustment when the category is "normal"
 * @param spaciousValue The adjustment when the category is "spacious"
 */
export function densityCategorySwitch<T = number>(
    compactValue: T | DesignSystemResolver<T>,
    normalValue: T | DesignSystemResolver<T>,
    spaciousValue: T | DesignSystemResolver<T>
): DesignSystemResolver<T> {
    return (designSystem: DesignSystem): T => {
        const category: DensityCategory = getDensityCategory(designSystem);
        const value: T =
            category === DensityCategory.compact
                ? checkDesignSystemResolver<T>(compactValue, designSystem)
                : category === DensityCategory.spacious
                    ? checkDesignSystemResolver<T>(spaciousValue, designSystem)
                    : checkDesignSystemResolver<T>(normalValue, designSystem);
        return value;
    };
}

/**
 * Returns the standard horizontal spacing for text and icons formatted in the provided unit or px by default.
 *
 * @param adjustment Any border that should be removed from the overall content spacing.
 * @param unit The unit of measurement; px by default.
 */
export function horizontalSpacing(
    adjustment: number | DesignSystemResolver<number> = 0,
    unit?: string
): DesignSystemResolver<string> {
    return (designSystem: DesignSystem): string => {
        const value: number =
            typeof adjustment === "function"
                ? horizontalSpacingNumber(adjustment(designSystem))(designSystem)
                : horizontalSpacingNumber(adjustment)(designSystem);
        return typeof unit === "string" ? `${value}${unit}` : toPx(value);
    };
}

/**
 * Returns the standard horizontal spacing for text and icons as a number.
 *
 * @param adjustment Any border that should be removed from the overall content spacing.
 */
export function horizontalSpacingNumber(
    adjustment: number = 0
): DesignSystemResolver<number> {
    return (designSystem: DesignSystem): number => {
        const densityOffset: number = densityCategorySwitch(-1, 0, 1)(designSystem);
        const value: number =
            (baseHorizontalSpacingMultiplier(designSystem) + densityOffset) *
                designUnit(designSystem) -
            adjustment;
        return value;
    };
}

/**
 * Returns the width and height for an icon formatted in pixels.
 *
 * @param designSystem The design system config.
 */
export function glyphSize(designSystem: DesignSystem): string;

/**
 * Returns the width and height for an icon formatted in the provided unit.
 *
 * @param unit The unit of measurement; px by default.
 */
export function glyphSize(unit: string): DesignSystemResolver<string>;

/**
 * Returns the width and height for an icon.
 *
 * @param arg The design system config or the unit of measurement.
 */
export function glyphSize(arg: any): any {
    return typeof arg === "string"
        ? (designSystem: DesignSystem): string => `${glyphSizeNumber(designSystem)}${arg}`
        : toPx(glyphSizeNumber(arg));
}

/**
 * Returns the width and height for an icon as a number.
 */
export function glyphSizeNumber(designSystem: DesignSystem): number {
    const halfDesignUnit: number = designUnit(designSystem) / 2;
    const sizeOffset: number = densityCategorySwitch(
        halfDesignUnit * -1,
        0,
        halfDesignUnit
    )(designSystem);
    const value: number =
        (baseHeightMultiplier(designSystem) / 2) * designUnit(designSystem) + sizeOffset;
    return value;
}

/**
 * @deprecated Use height instead.
 * @param value
 * @param unit
 */
export function density(value: number, unit?: string): (config: DesignSystem) => string {
    return (config: DesignSystem): string => {
        const augmented: number = value * 1;
        return typeof unit === "string" ? `${augmented}${unit}` : toPx(augmented);
    };
}
