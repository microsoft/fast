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
export function localizePadding(top, right, bottom, left) {
    return {
        padding: localizeSpacing(Direction.ltr)(
            `${toPx(top)} ${toPx(right)} ${toPx(bottom)} ${toPx(left)}`
        ),
    };
}
export function applyTriggerStyle(color) {
    return Object.assign(
        Object.assign(
            Object.assign(
                { lineHeight: "16px", "font-size": defaultTextSizeCSSProperty },
                localizePadding(3, 5, 2, 16)
            ),
            { border: "none", outline: "none", boxSizing: "border-box", color }
        ),
        ellipsis()
    );
}
export function boxShadow(config) {
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
export function insetStrongBoxShadow(color) {
    const shadow = {
        offsetX: 0,
        offsetY: 0,
        blurRadius: 0,
        spreadRadius: 1,
        color,
        inset: true,
    };
    return Object.assign({}, boxShadow(shadow));
}
export const interactiveFormControlIndicatorStyle = Object.assign(
    {
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
    },
    applyFocusVisible({
        borderColor: accentColorCSSProperty,
        outline: "none",
    })
);
export const formControlIndicatorStyle = {
    fill: textColorCSSProperty,
    padding: "0 4px",
    "align-self": "center",
    "min-width": "14px",
    "min-height": "14px",
};
export const formControlDisabledStyle = {
    opacity: disableOpacityCSSProperty,
    cursor: "not-allowed",
    "& label": {
        cursor: "not-allowed",
    },
};
/**
 * Used for styles radio buttons (vertical and horizontal alignment)
 */
export const inputBackplateStyle = {
    appearance: "none",
    height: "20px",
    width: "20px",
    margin: "0",
    backgroundColor: L1CSSProperty,
    "&:focus, &:hover": {
        outline: "none",
    },
};
export const selectSpanStyle = {
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
export const selectInputStyle = Object.assign(
    Object.assign(
        Object.assign(
            {
                width: "100%",
                lineHeight: "16px",
                "font-size": defaultTextSizeCSSProperty,
                background: L1CSSProperty,
                "border-radius": borderRadiusCSSProperty,
                appearance: "none",
                outline: "none",
            },
            localizePadding(3, 16, 2, 5)
        ),
        ellipsis()
    ),
    {
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
        "&:focus": Object.assign({}, insetStrongBoxShadow(accentColorCSSProperty)),
        "&:invalid": {
            border: `1px solid ${errorColorCSSProperty}`,
        },
    }
);
export const labelStyle = Object.assign(
    { flexGrow: "1", lineHeight: "16px", boxSizing: "border-box" },
    ellipsis()
);
export const labelRegionStyle = {
    display: "flex",
    maxWidth: "100%",
    "padding-bottom": "10px",
    height: "16px",
};
export const inputStyle = Object.assign(
    Object.assign(
        {
            lineHeight: "16px",
            "font-size": defaultTextSizeCSSProperty,
            backgroundColor: L1CSSProperty,
            "border-radius": borderRadiusCSSProperty,
        },
        localizePadding(3, 5, 2, 5)
    ),
    {
        border: "none",
        outline: "none",
        boxSizing: "border-box",
        color: textColorCSSProperty,
        "&:disabled": {
            cursor: "not-allowed",
        },
        "&:focus": Object.assign({}, insetStrongBoxShadow(accentColorCSSProperty)),
        "&:invalid": {
            border: `1px solid ${errorColorCSSProperty}`,
        },
        "&::placeholder": {
            color: "#767676",
        },
    }
);
/**
 * Common wrapper that surrounds a label and an input
 */
export const cleanListStyle = {
    listStyle: "none",
    margin: "0",
    padding: "0",
    listStylePosition: "outside",
};
export const defaultFontStyle = {
    color: inactiveTextColorCSSProperty,
    "font-style": "italic",
};
export const removeItemStyle = Object.assign(
    Object.assign(
        {
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
        },
        applyFocusVisible(
            Object.assign(
                Object.assign({}, insetStrongBoxShadow(accentColorCSSProperty)),
                { outline: "none" }
            )
        )
    ),
    {
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
    }
);
export const addItemStyle = Object.assign(
    Object.assign(
        {
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
        },
        applyFocusVisible(
            Object.assign(
                Object.assign({}, insetStrongBoxShadow(accentColorCSSProperty)),
                { outline: "none" }
            )
        )
    ),
    {
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
    }
);
export const chevronDownStyle = Object.assign(
    Object.assign(
        {
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
        },
        applyFocusVisible(
            Object.assign(
                Object.assign({}, insetStrongBoxShadow(accentColorCSSProperty)),
                { outline: "none" }
            )
        )
    ),
    {
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
    }
);
export const chevronUpStyle = Object.assign(Object.assign({}, chevronDownStyle), {
    transform: "rotate(180deg)",
});
export const controlWrapperStyle = {
    paddingTop: "8px",
    marginBottom: "12px",
};
export const controlSingleLineWrapperStyle = {
    display: "flex",
    minHeight: "30px",
    alignItems: "center",
};
export const controlStyle = {
    width: `calc(100% - ${gutterCSSProperty})`,
};
export const controlRegionStyle = {
    display: "flex",
    width: "100%",
    position: "relative",
};
export const softRemoveStyle = {
    display: "flex",
    height: "18px",
    "min-width": gutterCSSProperty,
    "justify-content": "center",
    "align-items": "center",
};
export const softRemoveInputStyle = Object.assign(
    Object.assign(
        {
            appearance: "none",
            background: "none",
            position: "absolute",
            border: "none",
            width: "18px",
            margin: "0",
            height: "18px",
            "z-index": "1",
            "border-radius": borderRadiusCSSProperty,
        },
        applyFocusVisible(
            Object.assign(
                Object.assign({}, insetStrongBoxShadow(accentColorCSSProperty)),
                { outline: "none" }
            )
        )
    ),
    {
        "& + svg": {
            fill: textColorCSSProperty,
        },
        "&:disabled + svg": {
            opacity: disableOpacityCSSProperty,
        },
    }
);
export const invalidMessageStyle = Object.assign(
    {
        color: errorColorCSSProperty,
        "font-size": statusMessageTextSizeCSSProperty,
        "margin-right": "10px",
    },
    ellipsis()
);
