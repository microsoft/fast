import { CSSRules } from "@microsoft/fast-jss-manager";
import {
    Direction,
    ellipsis,
    localizeSpacing,
    toPx,
} from "@microsoft/fast-jss-utilities";
import {
    accent,
    background300,
    background800,
    disabledOpacity,
    foreground200,
    foreground300,
    foreground800,
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

export function applyFormItemBadge(): CSSRules<{}> {
    return {
        fill: foreground800,
        padding: "0 5px",
        alignSelf: "center",
        minWidth: "12px",
    };
}

export function applyFormItemDisabled(): CSSRules<{}> {
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
        appearance: "none",
        background: "none",
        border: "none",
        padding: "0",
        width: "20px",
        height: "20px",
        zIndex: "1",
        borderRadius: "2px",
        "&:focus": {
            ...insetStrongBoxShadow(accent),
            outline: "none",
        },
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

export function applySoftRemove(): CSSRules<{}> {
    return {
        display: "flex",
        height: "23px",
        minWidth: "30px",
        position: "relative",
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
        zIndex: "1",
        borderRadius: "2px",
        "&:focus": {
            ...insetStrongBoxShadow(accent),
            outline: "none",
        },
        "& + svg": {
            fill: foreground800,
        },
        "&:disabled + svg": {
            opacity: `${disabledOpacity}`,
        },
    };
}
