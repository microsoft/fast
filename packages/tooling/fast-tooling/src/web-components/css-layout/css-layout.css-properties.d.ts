export declare type CSSLayoutCSSPropertyName =
    | "display"
    | "flex-wrap"
    | "align-items"
    | "align-content"
    | "flex-direction"
    | "justify-content"
    | "row-gap"
    | "column-gap";
export declare type ObservableFlexboxCSSPropertyName =
    | "flexDirectionValue"
    | "justifyContentValue"
    | "alignContentValue"
    | "alignItemsValue"
    | "flexWrapValue"
    | "rowGapValue"
    | "columnGapValue";
export declare type FlexboxSpacing = "space-between" | "space-around" | "space-evenly";
export declare type FlexboxPositioning = "flex-start" | "flex-end" | "center" | "stretch";
export declare type FlexboxWrap = "nowrap" | "wrap" | "wrap-reverse";
export declare type FlexboxOrientation =
    | "row"
    | "row-reverse"
    | "column"
    | "column-reverse";
export declare const cssLayoutCssProperties: Array<CSSLayoutCSSPropertyName>;
export declare type FlexDirection = FlexboxOrientation;
export declare const flexDirectionOptions: Array<FlexDirection>;
export declare type JustifyContent = FlexboxSpacing | FlexboxPositioning;
export declare const justifyContentOptions: Array<JustifyContent>;
export declare type AlignItems = FlexboxPositioning;
export declare const alignItemsOptions: Array<AlignItems>;
export declare type AlignContent = JustifyContent;
export declare const alignContentOptions: Array<AlignContent>;
export declare type FlexWrap = FlexboxWrap;
export declare const flexWrapOptions: Array<FlexWrap>;
