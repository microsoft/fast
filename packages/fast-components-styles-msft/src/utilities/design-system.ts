import defaultDesignSystem, {
    DesignSystem,
    DesignSystemResolver,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../design-system";
import { Palette } from "../utilities/color/palette";
import { toPx } from "@microsoft/fast-jss-utilities";
import { Direction } from "@microsoft/fast-web-utilities";

/**
 * Safely retrieves the value from a key of the designSystem.
 */
function getDesignSystemValue<T extends DesignSystem, K extends keyof T>(
    key: K
): (designSystem?: T) => T[K] {
    return (designSystem?: T): T[K] =>
        (designSystem && designSystem[key]) || (defaultDesignSystem as T)[key];
}

/**
 * Retrieve the backgroundColor when invoked with a DesignSystem
 */
export const backgroundColor: DesignSystemResolver<string> = getDesignSystemValue(
    "backgroundColor"
);

/**
 * Retrieve the neutral palette from the design system
 */
export const neutralPalette: DesignSystemResolver<Palette> = getDesignSystemValue(
    "neutralPalette"
);

/**
 * Retrieve the accent  palette from the design system
 */
export const accentPalette: DesignSystemResolver<Palette> = getDesignSystemValue(
    "accentPalette"
);

/**
 * Retrieve the contrast from the design system
 */
export const contrast: DesignSystemResolver<number> = getDesignSystemValue("contrast");

/**
 * Retrieve the designUnit when invoked with a DesignSystem
 * When invoked with a multiplier, a function is returned that accepts the DesignSystem,
 * which returns the designUnit multiplied by the multiplier
 */
export function designUnit(designSystem: DesignSystem): number;
export function designUnit(multiplier: number): DesignSystemResolver<number>;
export function designUnit(arg: any): any {
    const getDesignUnit: DesignSystemResolver<number> = getDesignSystemValue(
        "designUnit"
    );

    if (typeof arg === "number") {
        return (designSystem: DesignSystem): number => {
            return getDesignUnit(designSystem) * arg;
        };
    }

    return getDesignUnit(arg);
}

/**
 * Retrieve the baseHeightMultiplier from the design system
 */
export const baseHeightMultiplier: DesignSystemResolver<number> = getDesignSystemValue(
    "baseHeightMultiplier"
);

/**
 * Retrieve the baseHorizontalSpacingMultiplier from the design system
 */
export const baseHorizontalSpacingMultiplier: DesignSystemResolver<
    number
> = getDesignSystemValue("baseHorizontalSpacingMultiplier");

/**
 * Retrieve the direction from the design system
 */
export const direction: DesignSystemResolver<Direction> = getDesignSystemValue(
    "direction"
);

/**
 * Retrieve the outlineWidth when invoked with a DesignSystem
 * When invoked with a multiplier, a function is returned that accepts the DesignSystem,
 * which returns the outlineWidth multiplied by the multiplier
 */
export function outlineWidth(designSystem: DesignSystem): number;
export function outlineWidth(multiplier: number): DesignSystemResolver<number>;
export function outlineWidth(arg: any): any {
    if (typeof arg === "number") {
        return ensureDesignSystemDefaults(
            (designSystem: DesignSystem): number => {
                return designSystem.outlineWidth * arg;
            }
        );
    }

    return withDesignSystemDefaults(arg).outlineWidth;
}

/**
 * Retrieve the focusOutlineWidth when invoked with a DesignSystem
 * When invoked with a multiplier, a function is returned that accepts the DesignSystem,
 * which returns the focusOutlineWidth multiplied by the multiplier
 */
export function focusOutlineWidth(designSystem: DesignSystem): number;
export function focusOutlineWidth(multiplier: number): DesignSystemResolver<number>;
export function focusOutlineWidth(arg: any): any {
    if (typeof arg === "number") {
        return ensureDesignSystemDefaults(
            (designSystem: DesignSystem): number => {
                return designSystem.focusOutlineWidth * arg;
            }
        );
    }

    return withDesignSystemDefaults(arg).focusOutlineWidth;
}

/**
 * Retrieve the direction from the design system
 */
export const disabledOpacity: DesignSystemResolver<number> = getDesignSystemValue(
    "disabledOpacity"
);

export const accentFillRestDelta: DesignSystemResolver<number> = getDesignSystemValue(
    "accentFillRestDelta"
);
export const accentFillHoverDelta: DesignSystemResolver<number> = getDesignSystemValue(
    "accentFillHoverDelta"
);
export const accentFillActiveDelta: DesignSystemResolver<number> = getDesignSystemValue(
    "accentFillActiveDelta"
);
export const accentFillSelectedDelta: DesignSystemResolver<number> = getDesignSystemValue(
    "accentFillSelectedDelta"
);

export const accentForegroundRestDelta: DesignSystemResolver<
    number
> = getDesignSystemValue("accentForegroundRestDelta");
export const accentForegroundHoverDelta: DesignSystemResolver<
    number
> = getDesignSystemValue("accentForegroundHoverDelta");
export const accentForegroundActiveDelta: DesignSystemResolver<
    number
> = getDesignSystemValue("accentForegroundActiveDelta");

export const neutralFillRestDelta: DesignSystemResolver<number> = getDesignSystemValue(
    "neutralFillRestDelta"
);
export const neutralFillHoverDelta: DesignSystemResolver<number> = getDesignSystemValue(
    "neutralFillHoverDelta"
);
export const neutralFillActiveDelta: DesignSystemResolver<number> = getDesignSystemValue(
    "neutralFillActiveDelta"
);
export const neutralFillSelectedDelta: DesignSystemResolver<
    number
> = getDesignSystemValue("neutralFillSelectedDelta");

export const neutralFillInputRestDelta: DesignSystemResolver<
    number
> = getDesignSystemValue("neutralFillInputRestDelta");
export const neutralFillInputHoverDelta: DesignSystemResolver<
    number
> = getDesignSystemValue("neutralFillInputHoverDelta");
export const neutralFillInputActiveDelta: DesignSystemResolver<
    number
> = getDesignSystemValue("neutralFillInputActiveDelta");
export const neutralFillInputSelectedDelta: DesignSystemResolver<
    number
> = getDesignSystemValue("neutralFillInputSelectedDelta");

export const neutralFillStealthRestDelta: DesignSystemResolver<
    number
> = getDesignSystemValue("neutralFillStealthRestDelta");
export const neutralFillStealthHoverDelta: DesignSystemResolver<
    number
> = getDesignSystemValue("neutralFillStealthHoverDelta");
export const neutralFillStealthActiveDelta: DesignSystemResolver<
    number
> = getDesignSystemValue("neutralFillStealthActiveDelta");
export const neutralFillStealthSelectedDelta: DesignSystemResolver<
    number
> = getDesignSystemValue("neutralFillStealthSelectedDelta");

export const neutralForegroundDarkIndex: DesignSystemResolver<
    number
> = getDesignSystemValue("neutralForegroundDarkIndex");
export const neutralForegroundLightIndex: DesignSystemResolver<
    number
> = getDesignSystemValue("neutralForegroundLightIndex");
export const neutralForegroundHoverDelta: DesignSystemResolver<
    number
> = getDesignSystemValue("neutralForegroundHoverDelta");
export const neutralForegroundActiveDelta: DesignSystemResolver<
    number
> = getDesignSystemValue("neutralForegroundActiveDelta");

export const neutralOutlineRestDelta: DesignSystemResolver<number> = getDesignSystemValue(
    "neutralOutlineRestDelta"
);
export const neutralOutlineHoverDelta: DesignSystemResolver<
    number
> = getDesignSystemValue("neutralOutlineHoverDelta");
export const neutralOutlineActiveDelta: DesignSystemResolver<
    number
> = getDesignSystemValue("neutralOutlineActiveDelta");
