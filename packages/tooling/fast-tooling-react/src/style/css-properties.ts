export function assignCSSCustomProperty(
    customPropertyName: string,
    customPropertyValue: string | number
): string {
    return `var(${customPropertyName}, ${customPropertyValue})`;
}

const propertyNamePrefix = "--fast-tooling-";

/**
 * Layers
 *
 * These are the CSS custom properties for the layer background
 * The values start from L1 (the lightest) to L4 (the darkest).
 */

export const L1ColorName = `${propertyNamePrefix}l1-color`;
const L1ColorValue = "#333333";
export const L1CSSProperty = assignCSSCustomProperty(L1ColorName, L1ColorValue);

export const L2ColorName = `${propertyNamePrefix}l2-color`;
const L2ColorValue = "#2B2B2B";
export const L2CSSProperty = assignCSSCustomProperty(L2ColorName, L2ColorValue);

export const L3ColorName = `${propertyNamePrefix}l3-color`;
const L3ColorValue = "#242424";
export const L3CSSProperty = assignCSSCustomProperty(L3ColorName, L3ColorValue);

export const L3OutlineColorName = `${propertyNamePrefix}l3-outline-color`;
const L3OutlineColorValue = "#646464";
export const L3OutlineColorProperty = assignCSSCustomProperty(
    L3OutlineColorName,
    L3OutlineColorValue
);

export const L3FillColorName = `${propertyNamePrefix}l3-fill-color`;
const L3FillColorValue = "#4D4D4D";
export const L3FillColorProperty = assignCSSCustomProperty(
    L3FillColorName,
    L3FillColorValue
);

export const L4ColorName = `${propertyNamePrefix}l4-color`;
const L4ColorValue = "#1B1B1B";
export const L4CSSProperty = assignCSSCustomProperty(L4ColorName, L4ColorValue);

/**
 * Accent color
 */

export const accentColorName = `${propertyNamePrefix}accent-color`;
const accentColorValue = "#FF4387";
export const accentColorCSSProperty = assignCSSCustomProperty(
    accentColorName,
    accentColorValue
);

/**
 * Text colors
 */

export const textColorName = `${propertyNamePrefix}text-color`;
const textColorValue = "#F7F7F7";
export const textColorCSSProperty = assignCSSCustomProperty(
    textColorName,
    textColorValue
);

export const inactiveTextColorName = `${propertyNamePrefix}inactive-text-color`;
const inactiveTextColorValue = "#A2A2A2";
export const inactiveTextColorCSSProperty = assignCSSCustomProperty(
    inactiveTextColorName,
    inactiveTextColorValue
);

/**
 * Error color
 */

export const errorColorName = `${propertyNamePrefix}error-color`;
const errorColorValue = "red";
export const errorColorCSSProperty = assignCSSCustomProperty(
    errorColorName,
    errorColorValue
);

/**
 * Disable opacity
 */

export const disableOpacityName = `${propertyNamePrefix}disable-opacity`;
const disableOpacityValue = 0.3;
export const disableOpacityCSSProperty = assignCSSCustomProperty(
    disableOpacityName,
    disableOpacityValue
);

/**
 * Colors for code highlighting
 */

export const codeHighlightCSSKeyColorName = `${propertyNamePrefix}code-highlight-css-key`;
const codeHighlightCSSKeyColorValue = "#9CDCFE";
export const codeHighlightCSSKeyColor = assignCSSCustomProperty(
    codeHighlightCSSKeyColorName,
    codeHighlightCSSKeyColorValue
);

export const codeHighlightCSSValueColorName = `${propertyNamePrefix}code-highlight-css-value`;
const codeHighlightCSSValueColorValue = "#D4D4D4";
export const codeHighlightCSSValueColor = assignCSSCustomProperty(
    codeHighlightCSSValueColorName,
    codeHighlightCSSValueColorValue
);

/**
 * Border radius
 */

export const borderRadiusName = `${propertyNamePrefix}border-radius`;
const borderRadiusValue = "3px";
export const borderRadiusCSSProperty = assignCSSCustomProperty(
    borderRadiusName,
    borderRadiusValue
);

/**
 * Gutter
 */
export const gutterName = `${propertyNamePrefix}gutter`;
const gutterValue = "24px";
export const gutterCSSProperty = assignCSSCustomProperty(gutterName, gutterValue);

/**
 * Text size
 */
export const defaultTextSizeName = `${propertyNamePrefix}text-size-default`;
const defaultTextSizeValue = "12px";
export const defaultTextSizeCSSProperty = assignCSSCustomProperty(
    defaultTextSizeName,
    defaultTextSizeValue
);

export const statusMessageTextSizeName = `${propertyNamePrefix}text-size-status-message`;
const statusMessageTextSizeValue = `11px`;
export const statusMessageTextSizeCSSProperty = assignCSSCustomProperty(
    statusMessageTextSizeName,
    statusMessageTextSizeValue
);
