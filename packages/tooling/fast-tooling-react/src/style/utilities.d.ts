import { CSSRules } from "@microsoft/fast-jss-manager-react";
export interface BoxShadowConfig {
    offsetX: number;
    offsetY: number;
    blurRadius: number;
    spreadRadius: number;
    color: string;
    inset?: boolean;
}
export declare function localizePadding(
    top: number,
    right: number,
    bottom: number,
    left: number
): CSSRules<{}>;
export declare function applyTriggerStyle(color: string): CSSRules<{}>;
export declare function boxShadow(config: BoxShadowConfig): CSSRules<{}>;
/**
 * Mimics a border but with boxShadow (strong in the sense of no blur)
 */
export declare function insetStrongBoxShadow(color: string): CSSRules<{}>;
export declare const interactiveFormControlIndicatorStyle: CSSRules<{}>;
export declare const formControlIndicatorStyle: CSSRules<{}>;
export declare const formControlDisabledStyle: CSSRules<{}>;
/**
 * Used for styles radio buttons (vertical and horizontal alignment)
 */
export declare const inputBackplateStyle: CSSRules<{}>;
export declare const selectSpanStyle: CSSRules<{}>;
export declare const selectInputStyle: CSSRules<{}>;
export declare const labelStyle: CSSRules<{}>;
export declare const labelRegionStyle: CSSRules<{}>;
export declare const inputStyle: CSSRules<{}>;
/**
 * Common wrapper that surrounds a label and an input
 */
export declare const cleanListStyle: CSSRules<{}>;
export declare const defaultFontStyle: CSSRules<{}>;
export declare const removeItemStyle: CSSRules<{}>;
export declare const addItemStyle: CSSRules<{}>;
export declare const chevronDownStyle: CSSRules<{}>;
export declare const chevronUpStyle: CSSRules<{}>;
export declare const controlWrapperStyle: CSSRules<{}>;
export declare const controlSingleLineWrapperStyle: CSSRules<{}>;
export declare const controlStyle: CSSRules<{}>;
export declare const controlRegionStyle: CSSRules<{}>;
export declare const softRemoveStyle: CSSRules<{}>;
export declare const softRemoveInputStyle: CSSRules<{}>;
export declare const invalidMessageStyle: CSSRules<{}>;
