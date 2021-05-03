export function assignCSSCustomProperty(
    customPropertyName: string,
    defaultPropertyValue: string | number
): string {
    return `var(${customPropertyName}, ${defaultPropertyValue})`;
}

const propertyNamePrefix = "--fast-tooling-";

export const AccentFillRestName = `${propertyNamePrefix}accent-fill-rest`;
const AccentFillRestValue = "#DD2D6C";
export const AccentFillRestProperty = assignCSSCustomProperty(
    AccentFillRestName,
    AccentFillRestValue
);

export const BackgroundColorName = `${propertyNamePrefix}background-color`;
const BackgroundColorValue = "#fff";
export const BackgroundColorProperty = assignCSSCustomProperty(
    BackgroundColorName,
    BackgroundColorValue
);

export const ForegroundColorName = `${propertyNamePrefix}foreground-color`;
const ForegroundColorValue = "#2B2B2B";
export const ForegroundColorProperty = assignCSSCustomProperty(
    ForegroundColorName,
    ForegroundColorValue
);

export const FocusOutlineWidthName = `${propertyNamePrefix}focus-outline-width`;
const FocusOutlineWidthValue = "2";
export const FocusOutlineWidthProperty = assignCSSCustomProperty(
    FocusOutlineWidthName,
    FocusOutlineWidthValue
);

export const FontSize1Name = `${propertyNamePrefix}font-size-1`;
const FontSize1Value = "12px";
export const FontSize1Property = assignCSSCustomProperty(FontSize1Name, FontSize1Value);

export const LineHeight1Name = `${propertyNamePrefix}line-height-1`;
const LineHeight1Value = "16px";
export const LineHeight1Property = assignCSSCustomProperty(
    LineHeight1Name,
    LineHeight1Value
);
