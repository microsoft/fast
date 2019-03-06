import { CSSRules } from "@microsoft/fast-jss-manager";
import {
    Direction,
    ellipsis,
    localizeSpacing,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { accent, background300, background800, foreground300 } from "./constants";

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
