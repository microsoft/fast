import { DesignSystemResolver, getDesignSystemValue } from "../design-system";
import { Palette } from "../utilities/color/palette";
import { Direction } from "@microsoft/fast-web-utilities";

/**
 * Retrieve the backgroundColor when invoked with a DesignSystem
 */
export const backgroundColor: DesignSystemResolver<string> = getDesignSystemValue(
    "backgroundColor"
);

/**
 * Retrieve the backgroundColor when invoked with a DesignSystem
 */
export const cornerRadius: DesignSystemResolver<number> = getDesignSystemValue(
    "cornerRadius"
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
 * Retrieve the designUnit from the design system
 */
export const designUnit: DesignSystemResolver<number> = getDesignSystemValue(
    "designUnit"
);

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
 * Retrieve the outlineWidth from the design system
 */
export const outlineWidth: DesignSystemResolver<number> = getDesignSystemValue(
    "outlineWidth"
);

/**
 * Retrieve the focusOutlineWidth from the design system
 */
export const focusOutlineWidth: DesignSystemResolver<number> = getDesignSystemValue(
    "focusOutlineWidth"
);
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
