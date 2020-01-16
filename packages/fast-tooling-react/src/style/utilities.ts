import { CSSRules } from "@microsoft/fast-jss-manager-react";
import {
    applyFocusVisible,
    Direction,
    ellipsis,
    localizeSpacing,
    toPx,
} from "@microsoft/fast-jss-utilities";
import {
    accent,
    background800,
    disabledOpacity,
    error,
    foreground200,
    foreground300,
    foreground800,
    neutralLayerL4,
} from "./constants";

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
        fontSize: "12px",
        ...localizePadding(3, 5, 2, 16),
        border: "none",
        outline: "none",
        boxSizing: "border-box",
        color,
        ...ellipsis(),
    };
}

export function applyInteractiveFormControlIndicator(): CSSRules<{}> {
    return {
        display: "flex",
        padding: "0",
        alignSelf: "center",
        background: "transparent",
        border: "1px solid transparent",
        borderRadius: "2px",
        "& svg": {
            fill: foreground800,
            "min-height": "18px",
            "min-width": "18px",
            "box-sizing": "border-box",
            padding: "1px 0",
        },
        "&:hover": {
            "& svg": {
                fill: accent,
            },
        },
        ...applyFocusVisible({
            borderColor: accent,
            outline: "none",
        }),
    };
}

export function applyFormControlIndicator(): CSSRules<{}> {
    return {
        fill: foreground800,
        padding: "0 4px",
        "align-self": "center",
        "min-width": "14px",
        "min-height": "14px",
    };
}

export function applyFormControlDisabled(): CSSRules<{}> {
    return {
        opacity: `${disabledOpacity}`,
        cursor: "not-allowed",
        "& label": {
            cursor: "not-allowed",
        },
    };
}

/**
 * Used for styles radio buttons (vertical and horizontal alignment)
 */
export function applyInputBackplateStyle(): CSSRules<{}> {
    return {
        appearance: "none",
        height: "20px",
        width: "20px",
        margin: "0",
        backgroundColor: background800,
        "&:focus, &:hover": {
            outline: "none",
        },
    };
}

export function applySelectSpanStyles(): CSSRules<{}> {
    return {
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
            borderTop: `3px solid ${foreground300}`,
        },
    };
}

export function applySelectInputStyles(): CSSRules<{}> {
    return {
        width: "100%",
        lineHeight: "16px",
        fontSize: "12px",
        backgroundColor: background800,
        borderRadius: "2px",
        appearance: "none",
        outline: "none",
        ...localizePadding(3, 5, 2, 5),
        border: "none",
        color: foreground300,
        "&:-ms-expand": {
            display: "none",
        },
        "& option": {
            background: neutralLayerL4,
        },
        "&:disabled": {
            cursor: "not-allowed",
        },
        "&:focus": {
            ...insetStrongBoxShadow(accent),
        },
        "&:invalid": {
            border: `1px solid ${error}`,
        },
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

export function applyLabelStyle(): CSSRules<{}> {
    return {
        flexGrow: "1",
        lineHeight: "23px",
        fontSize: "12px",
        minHeight: "23px",
        boxSizing: "border-box",
        ...ellipsis(),
    };
}

export function applyLabelRegionStyle(): CSSRules<{}> {
    return {
        display: "flex",
        maxWidth: "100%",
    };
}

export function applyInputStyle(): CSSRules<{}> {
    return {
        lineHeight: "16px",
        fontSize: "12px",
        backgroundColor: background800,
        borderRadius: "2px",
        ...localizePadding(3, 5, 2, 5),
        border: "none",
        outline: "none",
        boxSizing: "border-box",
        color: foreground300,
        "&:disabled": {
            cursor: "not-allowed",
        },
        "&:focus": {
            ...insetStrongBoxShadow(accent),
        },
        "&:invalid": {
            border: `1px solid ${error}`,
        },
        "&::placeholder": {
            color: "#767676",
        },
    };
}

/**
 * Common wrapper that surrounds a label and an input
 */
export function applyCleanListStyle(): CSSRules<{}> {
    return {
        listStyle: "none",
        margin: "0",
        padding: "0",
        listStylePosition: "outside",
    };
}

export function applyGlobalStyle(): CSSRules<{}> {
    return {
        'body > li[draggable="true"]': {
            boxShadow: `0 4px 4px 4px rgba(0, 0, 0, 0.15)`,
            borderColor: "transparent",
            listStyleType: "none",
            listStyle: "none",
            background: foreground200,
        },
    };
}

export function applyAriaHiddenStyles(): CSSRules<{}> {
    return {
        '&[aria-hidden="true"]': {
            display: "none",
        },
        '&[aria-hidden="false"]': {
            display: "block",
        },
    };
}

export function applyRemoveItemStyle(): CSSRules<{}> {
    return {
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
        borderRadius: "2px",
        ...applyFocusVisible({
            ...insetStrongBoxShadow(accent),
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
            background: foreground300,
        },
    };
}

export function applyAddItemStyle(): CSSRules<{}> {
    return {
        position: "absolute",
        right: "5px",
        top: "1px",
        appearance: "none",
        background: "none",
        border: "none",
        width: "20px",
        height: "20px",
        zIndex: "1",
        borderRadius: "2px",
        ...applyFocusVisible({
            ...insetStrongBoxShadow(accent),
            outline: "none",
        }),
        "&::before, &::after": {
            position: "absolute",
            content: "''",
            pointerEvents: "none",
            background: foreground300,
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
}

export const chevronDown: CSSRules<{}> = {
    position: "absolute",
    right: "5px",
    top: "1px",
    appearance: "none",
    background: "none",
    border: "none",
    width: "20px",
    height: "20px",
    zIndex: "1",
    borderRadius: "2px",
    ...applyFocusVisible({
        ...insetStrongBoxShadow(accent),
        outline: "none",
    }),
    "&::before, &::after": {
        position: "absolute",
        content: "''",
        pointerEvents: "none",
        background: foreground300,
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

export const chevronUp: CSSRules<{}> = {
    ...chevronDown,
    transform: "rotate(180deg)",
};

export function applyControlWrapper(): CSSRules<{}> {
    return {
        paddingTop: "7px",
        marginBottom: "12px",
    };
}

export function applyControlSingleLineWrapper(): CSSRules<{}> {
    return {
        display: "flex",
        minHeight: "30px",
        alignItems: "center",
    };
}

export function applyControl(): CSSRules<{}> {
    return {
        width: `calc(100% - 30px)`,
    };
}

export function applyControlRegion(): CSSRules<{}> {
    return {
        display: "flex",
        width: "100%",
        position: "relative",
    };
}

export function applySoftRemove(): CSSRules<{}> {
    return {
        display: "flex",
        height: "23px",
        minWidth: "30px",
        justifyContent: "center",
        alignItems: "center",
    };
}

export function applySoftRemoveInput(): CSSRules<{}> {
    return {
        appearance: "none",
        background: "none",
        position: "absolute",
        border: "none",
        width: "20px",
        margin: "0",
        height: "20px",
        "z-index": "1",
        "border-radius": "2px",
        ...applyFocusVisible({
            ...insetStrongBoxShadow(accent),
            outline: "none",
        }),
        "& + svg": {
            fill: foreground800,
            "padding-top": "1px",
        },
        "&:disabled + svg": {
            opacity: `${disabledOpacity}`,
        },
    };
}

export function applyInvalidMessage(): CSSRules<{}> {
    return {
        color: error,
        fontSize: "11px",
        marginRight: "10px",
        ...ellipsis(),
    };
}
