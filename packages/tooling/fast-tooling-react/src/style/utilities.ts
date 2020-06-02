import { CSSRules } from "@microsoft/fast-jss-manager-react";
import {
    applyFocusVisible,
    Direction,
    ellipsis,
    localizeSpacing,
    toPx,
} from "@microsoft/fast-jss-utilities";
import {
    accentColorCSSProperty,
    borderRadiusCSSProperty,
    defaultTextSizeCSSProperty,
    disableOpacityCSSProperty,
    errorColorCSSProperty,
    gutterCSSProperty,
    inactiveTextColorCSSProperty,
    L1CSSProperty,
    L4CSSProperty,
    statusMessageTextSizeCSSProperty,
    textColorCSSProperty,
} from "./css-properties";

export interface BoxShadowConfig {
    offsetX: number;
    offsetY: number;
    blurRadius: number;
    spreadRadius: number;
    color: string;
    inset?: boolean;
}

export function localizePadding(
    top: number,
    right: number,
    bottom: number,
    left: number
): CSSRules<{}> {
    return {
        padding: localizeSpacing(Direction.ltr)(
            `${toPx(top)} ${toPx(right)} ${toPx(bottom)} ${toPx(left)}`
        ),
    };
}

export function applyTriggerStyle(color: string): CSSRules<{}> {
    return {
        lineHeight: "16px",
        "font-size": defaultTextSizeCSSProperty,
        ...localizePadding(3, 5, 2, 16),
        border: "none",
        outline: "none",
        boxSizing: "border-box",
        color,
        ...ellipsis(),
    };
}

export function boxShadow(config: BoxShadowConfig): CSSRules<{}> {
    return {
        boxShadow: `${config.inset ? "inset " : ""}
        ${toPx(config.offsetX)} ${toPx(config.offsetY)} ${toPx(config.blurRadius)} ${toPx(
            config.spreadRadius
        )} ${config.color}`,
    };
}

/**
 * Mimics a border but with boxShadow (strong in the sense of no blur)
 */
export function insetStrongBoxShadow(color: string): CSSRules<{}> {
    const shadow: BoxShadowConfig = {
        offsetX: 0,
        offsetY: 0,
        blurRadius: 0,
        spreadRadius: 1,
        color,
        inset: true,
    };

    return {
        ...boxShadow(shadow),
    };
}

export const interactiveFormControlIndicatorStyle: CSSRules<{}> = {
    display: "flex",
    padding: "0",
    alignSelf: "center",
    background: "transparent",
    border: "1px solid transparent",
    borderRadius: borderRadiusCSSProperty,
    "& svg": {
        fill: textColorCSSProperty,
        "min-height": "18px",
        "min-width": "18px",
        "box-sizing": "border-box",
        padding: "1px 0",
    },
    "&:hover": {
        "& svg": {
            fill: accentColorCSSProperty,
        },
    },
    ...applyFocusVisible({
        borderColor: accentColorCSSProperty,
        outline: "none",
    }),
};

export const formControlIndicatorStyle: CSSRules<{}> = {
    fill: textColorCSSProperty,
    padding: "0 4px",
    "align-self": "center",
    "min-width": "14px",
    "min-height": "14px",
};

export const formControlDisabledStyle: CSSRules<{}> = {
    opacity: disableOpacityCSSProperty,
    cursor: "not-allowed",
    "& label": {
        cursor: "not-allowed",
    },
};

/**
 * Used for styles radio buttons (vertical and horizontal alignment)
 */
export const inputBackplateStyle: CSSRules<{}> = {
    appearance: "none",
    height: "20px",
    width: "20px",
    margin: "0",
    backgroundColor: L1CSSProperty,
    "&:focus, &:hover": {
        outline: "none",
    },
};

export const selectSpanStyle: CSSRules<{}> = {
    position: "relative",
    display: "flex",
    "&::before": {
        content: "''",
        position: "absolute",
        top: "9px",
        right: "4px",
        zIndex: "1",
        borderLeft: "3px solid transparent",
        borderRight: "3px solid transparent",
        borderTop: `3px solid ${textColorCSSProperty}`,
    },
};

export const selectInputStyle: CSSRules<{}> = {
    width: "100%",
    lineHeight: "16px",
    "font-size": defaultTextSizeCSSProperty,
    background: L1CSSProperty,
    "border-radius": borderRadiusCSSProperty,
    appearance: "none",
    outline: "none",
    ...localizePadding(3, 16, 2, 5),
    ...ellipsis(),
    border: "none",
    color: textColorCSSProperty,
    "&:-ms-expand": {
        display: "none",
    },
    "& option": {
        background: L4CSSProperty,
    },
    "&:disabled": {
        cursor: "not-allowed",
    },
    "&:focus": {
        ...insetStrongBoxShadow(accentColorCSSProperty),
    },
    "&:invalid": {
        border: `1px solid ${errorColorCSSProperty}`,
    },
};

export const labelStyle: CSSRules<{}> = {
    flexGrow: "1",
    lineHeight: "16px",
    boxSizing: "border-box",
    ...ellipsis(),
};

export const labelRegionStyle: CSSRules<{}> = {
    display: "flex",
    maxWidth: "100%",
    "padding-bottom": "10px",
    height: "16px",
};

export const inputStyle: CSSRules<{}> = {
    lineHeight: "16px",
    "font-size": defaultTextSizeCSSProperty,
    backgroundColor: L1CSSProperty,
    "border-radius": borderRadiusCSSProperty,
    ...localizePadding(3, 5, 2, 5),
    border: "none",
    outline: "none",
    boxSizing: "border-box",
    color: textColorCSSProperty,
    "&:disabled": {
        cursor: "not-allowed",
    },
    "&:focus": {
        ...insetStrongBoxShadow(accentColorCSSProperty),
    },
    "&:invalid": {
        border: `1px solid ${errorColorCSSProperty}`,
    },
    "&::placeholder": {
        color: "#767676",
    },
};

/**
 * Common wrapper that surrounds a label and an input
 */
export const cleanListStyle: CSSRules<{}> = {
    listStyle: "none",
    margin: "0",
    padding: "0",
    listStylePosition: "outside",
};

export const defaultFontStyle: CSSRules<{}> = {
    color: inactiveTextColorCSSProperty,
    "font-style": "italic",
};

export const removeItemStyle: CSSRules<{}> = {
    position: "absolute",
    top: "5px",
    right: "5px",
    appearance: "none",
    background: "none",
    border: "none",
    padding: "0",
    width: "20px",
    height: "20px",
    zIndex: "1",
    borderRadius: borderRadiusCSSProperty,
    ...applyFocusVisible({
        ...insetStrongBoxShadow(accentColorCSSProperty),
        outline: "none",
    }),
    "&::before": {
        position: "absolute",
        content: "''",
        pointerEvents: "none",
        width: "9px",
        height: "1px",
        left: "5.5px",
        top: "9.5px",
        background: textColorCSSProperty,
    },
};

export const addItemStyle: CSSRules<{}> = {
    position: "absolute",
    right: "5px",
    top: "1px",
    appearance: "none",
    background: "none",
    border: "none",
    width: "20px",
    height: "20px",
    zIndex: "1",
    borderRadius: borderRadiusCSSProperty,
    ...applyFocusVisible({
        ...insetStrongBoxShadow(accentColorCSSProperty),
        outline: "none",
    }),
    "&::before, &::after": {
        position: "absolute",
        content: "''",
        pointerEvents: "none",
        background: textColorCSSProperty,
    },
    "&::before": {
        width: "9px",
        height: "1px",
        left: "5.5px",
        top: "9.5px",
    },
    "&::after": {
        width: "1px",
        height: "9px",
        left: "9.5px",
        top: "5.5px",
    },
};

export const chevronDownStyle: CSSRules<{}> = {
    position: "absolute",
    right: "5px",
    top: "1px",
    appearance: "none",
    background: "none",
    border: "none",
    width: "20px",
    height: "20px",
    zIndex: "1",
    borderRadius: borderRadiusCSSProperty,
    ...applyFocusVisible({
        ...insetStrongBoxShadow(accentColorCSSProperty),
        outline: "none",
    }),
    "&::before, &::after": {
        position: "absolute",
        content: "''",
        pointerEvents: "none",
        background: textColorCSSProperty,
        transform: "rotate(45deg)",
    },
    "&::before": {
        width: "7px",
        height: "1px",
        left: "3.5px",
        top: "9.5px",
    },
    "&::after": {
        width: "1px",
        height: "7px",
        left: "11.5px",
        top: "6.5px",
    },
};

export const chevronUpStyle: CSSRules<{}> = {
    ...chevronDownStyle,
    transform: "rotate(180deg)",
};

export const controlWrapperStyle: CSSRules<{}> = {
    paddingTop: "8px",
    marginBottom: "12px",
};

export const controlSingleLineWrapperStyle: CSSRules<{}> = {
    display: "flex",
    minHeight: "30px",
    alignItems: "center",
};

export const controlStyle: CSSRules<{}> = {
    width: `calc(100% - ${gutterCSSProperty})`,
};

export const controlRegionStyle: CSSRules<{}> = {
    display: "flex",
    width: "100%",
    position: "relative",
};

export const softRemoveStyle: CSSRules<{}> = {
    display: "flex",
    height: "18px",
    "min-width": gutterCSSProperty,
    "justify-content": "center",
    "align-items": "center",
};

export const softRemoveInputStyle: CSSRules<{}> = {
    appearance: "none",
    background: "none",
    position: "absolute",
    border: "none",
    width: "18px",
    margin: "0",
    height: "18px",
    "z-index": "1",
    "border-radius": borderRadiusCSSProperty,
    ...applyFocusVisible({
        ...insetStrongBoxShadow(accentColorCSSProperty),
        outline: "none",
    }),
    "& + svg": {
        fill: textColorCSSProperty,
    },
    "&:disabled + svg": {
        opacity: disableOpacityCSSProperty,
    },
};

export const invalidMessageStyle: CSSRules<{}> = {
    color: errorColorCSSProperty,
    "font-size": statusMessageTextSizeCSSProperty,
    "margin-right": "10px",
    ...ellipsis(),
};
