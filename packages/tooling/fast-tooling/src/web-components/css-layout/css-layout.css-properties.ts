export type CSSLayoutCSSPropertyName =
    | "display"
    | "flex-wrap"
    | "align-items"
    | "align-content"
    | "flex-direction"
    | "justify-content"
    | "row-gap"
    | "column-gap";

export type ObservableFlexboxCSSPropertyName =
    | "flexDirectionValue"
    | "justifyContentValue"
    | "alignContentValue"
    | "alignItemsValue"
    | "flexWrapValue"
    | "rowGapValue"
    | "columnGapValue";

export type FlexboxSpacing = "space-between" | "space-around" | "space-evenly";

export type FlexboxPositioning = "flex-start" | "flex-end" | "center" | "stretch";

export type FlexboxWrap = "nowrap" | "wrap" | "wrap-reverse";

export type FlexboxOrientation = "row" | "row-reverse" | "column" | "column-reverse";

export const cssLayoutCssProperties: Array<CSSLayoutCSSPropertyName> = [
    "display",
    "flex-wrap",
    "align-items",
    "align-content",
    "flex-direction",
    "justify-content",
    "row-gap",
    "column-gap",
];

export type FlexDirection = FlexboxOrientation;

export const flexDirectionOptions: Array<FlexDirection> = [
    "row",
    "row-reverse",
    "column",
    "column-reverse",
];

export type JustifyContent = FlexboxSpacing | FlexboxPositioning;

export const justifyContentOptions: Array<JustifyContent> = [
    "flex-start",
    "flex-end",
    "center",
    "stretch",
    "space-between",
    "space-around",
    "space-evenly",
];

export type AlignItems = FlexboxPositioning;

export const alignItemsOptions: Array<AlignItems> = [
    "flex-start",
    "flex-end",
    "center",
    "stretch",
];

export type AlignContent = JustifyContent;

export const alignContentOptions: Array<AlignContent> = justifyContentOptions;

export type FlexWrap = FlexboxWrap;

export const flexWrapOptions: Array<FlexWrap> = ["wrap", "wrap-reverse", "nowrap"];
