import { toPx, toUnit } from "@microsoft/fast-jss-utilities";
import {
    checkDesignSystemResolver,
    DesignSystem,
    DesignSystemResolver,
} from "../design-system";
import { getDesignSystemValue } from "../utilities/design-system";
import {
    baseHeightMultiplier,
    baseHorizontalSpacingMultiplier,
    designUnit,
} from "../utilities/design-system";

export enum DensityCategory {
    compact = "compact",
    normal = "normal",
    spacious = "spacious",
}

/**
 * Returns the component height as a number.
 *
 * @param lines The logical number of lines the component takes, typically 1.
 */
export function heightNumber(lines: number = 1): DesignSystemResolver<number> {
    return (designSystem: DesignSystem): number => {
        return (
            (baseHeightMultiplier(designSystem) +
                getDesignSystemValue("density")(designSystem)) *
            designUnit(designSystem) *
            lines
        );
    };
}

/**
 * Returns the component height formatted in the provided unit or px by default.
 *
 * @param lines The logical number of lines the component takes, typically 1.
 * @param unit The unit of measurement; px by default.
 */
export function height(lines: number = 1, unit?: string): DesignSystemResolver<string> {
    return (designSystem: DesignSystem): string =>
        toUnit(unit)(heightNumber(lines)(designSystem));
}

/**
 * Returns the higher-level category for the density setting.
 *
 * @param designSystem The design system config.
 */
export function getDensityCategory(designSystem: DesignSystem): DensityCategory {
    const densityValue: number = getDesignSystemValue("density")(designSystem);
    return densityValue >= 2
        ? DensityCategory.spacious
        : densityValue <= -2
        ? DensityCategory.compact
        : DensityCategory.normal;
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
        return checkDesignSystemResolver(
            category === DensityCategory.compact
                ? compactValue
                : category === DensityCategory.spacious
                ? spaciousValue
                : normalValue,
            designSystem
        );
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
        return (
            (baseHorizontalSpacingMultiplier(designSystem) +
                densityCategorySwitch(-1, 0, 1)(designSystem)) *
                designUnit(designSystem) -
            adjustment
        );
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
        return toUnit(unit)(
            horizontalSpacingNumber(checkDesignSystemResolver(adjustment, designSystem))(
                designSystem
            )
        );
    };
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
    return (
        (baseHeightMultiplier(designSystem) / 2) * designUnit(designSystem) + sizeOffset
    );
}

/**
 * Returns the width and height for an icon formatted in pixels.
 */
export function glyphSize(designSystem: DesignSystem): string;
export function glyphSize(unit: string): DesignSystemResolver<string>;
export function glyphSize(arg: any): any {
    return typeof arg === "string"
        ? (designSystem: DesignSystem): string =>
              toUnit(arg)(glyphSizeNumber(designSystem))
        : toPx(glyphSizeNumber(arg));
}

/**
 * @deprecated Use height instead.
 * @param value
 * @param unit
 */
export function density(value: number, unit?: string): (config: DesignSystem) => string {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    return (config: DesignSystem): string => toUnit(unit)(value * 1);
}
