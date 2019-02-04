import { CSSRules } from "@microsoft/fast-jss-manager";
import { Direction, localizeSpacing, toPx } from "@microsoft/fast-jss-utilities";
import {
    accent,
    background300,
    background800,
    disabledOpacity,
    foreground300,
} from "./editor.constants.style";

export interface BoxShadowConfig {
    offsetX: number;
    offsetY: number;
    blurRadius: number;
    spreadRadius: number;
    color: string;
    inset?: boolean;
}

export function boxShadow(config: BoxShadowConfig): CSSRules<{}> {
    return {
        boxShadow: `${config.inset ? "inset " : ""}
        ${toPx(config.offsetX)} ${toPx(config.offsetY)} ${toPx(config.blurRadius)} ${toPx(
            config.spreadRadius
        )} ${config.color}`,
    };
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

export function applySelectInputStyles(): CSSRules<{}> {
    return {
        width: "100%",
        lineHeight: "15px",
        fontSize: "11px",
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
            background: background300,
        },
        "&:disabled": {
            cursor: "not-allowed",
        },
        "&:focus": {
            ...insetStrongBoxShadow(accent),
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

export function applyInputStyle(): CSSRules<{}> {
    return {
        lineHeight: "15px",
        fontSize: "11px",
        backgroundColor: background800,
        borderRadius: "2px",
        ...localizePadding(3, 5, 2, 5),
        border: "none",
        outline: "none",
        boxSizing: "border-box",
        color: foreground300,
        "&:disabled": {
            opacity: `${disabledOpacity}`,
            cursor: "not-allowed",
        },
        "&:focus": {
            ...insetStrongBoxShadow(accent),
        },
    };
}
