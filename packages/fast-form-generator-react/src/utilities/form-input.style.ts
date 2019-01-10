import { CSSRules } from "@microsoft/fast-jss-manager";
import {
    Direction,
    ellipsis,
    localizeSpacing,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { colors } from "./";

/**
 * Base64 encoded svgs
 */
/* tslint:disable */
export const lightTheme: string =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNCAxNSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iQ2FudmFzIiBmaWxsPSJub25lIj48ZyBpZD0iQSI+PHBhdGggZD0iTSAxMy45MTYgMjJMIDEwLjQ3ODUgMjJMIDkuNDgyNDIgMTguODg0OEwgNC41MDE5NSAxOC44ODQ4TCAzLjUxNTYyIDIyTCAwLjA5NzY1NjIgMjJMIDUuMTk1MzEgNy45OTYwOUwgOC45MzU1NSA3Ljk5NjA5TCAxMy45MTYgMjJaTSA4Ljc1OTc3IDE2LjQ2MjlMIDcuMjU1ODYgMTEuNzU1OUMgNy4xNDUxOCAxMS40MDQzIDcuMDY3MDYgMTAuOTg0NCA3LjAyMTQ4IDEwLjQ5NjFMIDYuOTQzMzYgMTAuNDk2MUMgNi45MTA4MSAxMC45MDYyIDYuODI5NDMgMTEuMzEzMiA2LjY5OTIyIDExLjcxNjhMIDUuMTc1NzggMTYuNDYyOUwgOC43NTk3NyAxNi40NjI5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNykiIGZpbGw9ImJsYWNrIi8+PC9nPjwvZz48L3N2Zz4=) center no-repeat";
export const darkTheme: string =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNCAxNSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iQ2FudmFzIiBmaWxsPSJub25lIj48ZyBpZD0iQSI+PHBhdGggZD0iTSAxMy45MTYgMjJMIDEwLjQ3ODUgMjJMIDkuNDgyNDIgMTguODg0OEwgNC41MDE5NSAxOC44ODQ4TCAzLjUxNTYyIDIyTCAwLjA5NzY1NjIgMjJMIDUuMTk1MzEgNy45OTYwOUwgOC45MzU1NSA3Ljk5NjA5TCAxMy45MTYgMjJaTSA4Ljc1OTc3IDE2LjQ2MjlMIDcuMjU1ODYgMTEuNzU1OUMgNy4xNDUxOCAxMS40MDQzIDcuMDY3MDYgMTAuOTg0NCA3LjAyMTQ4IDEwLjQ5NjFMIDYuOTQzMzYgMTAuNDk2MUMgNi45MTA4MSAxMC45MDYyIDYuODI5NDMgMTEuMzEzMiA2LjY5OTIyIDExLjcxNjhMIDUuMTc1NzggMTYuNDYyOUwgOC43NTk3NyAxNi40NjI5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNykiIGZpbGw9IndoaXRlIi8+PC9nPjwvZz48L3N2Zz4=) center no-repeat";
/* tslint:enable */

export interface BoxShadowConfig {
    offsetX: number;
    offsetY: number;
    blurRadius: number;
    spreadRadius: number;
    color: string;
    inset?: boolean;
}

export const DISABLED_OPACITY: number = 0.3;

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
        lineHeight: "15px",
        fontSize: "11px",
        minHeight: "30px",
        display: "flex",
        boxSizing: "border-box",
        paddingTop: "7px",
        ...ellipsis(),
    };
}

export function applyInputStyle(): CSSRules<{}> {
    return {
        lineHeight: "15px",
        fontSize: "11px",
        backgroundColor: colors.background800,
        borderRadius: "2px",
        ...localizePadding(3, 5, 2, 5),
        border: "none",
        outline: "none",
        boxSizing: "border-box",
        color: colors.foreground300,
        "&:disabled": {
            opacity: `${DISABLED_OPACITY}`,
            cursor: "not-allowed",
        },
        "&:focus": {
            ...insetStrongBoxShadow(colors.pink),
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
            background: colors.foreground200,
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

/**
 * Used for styles radio buttons (vertical and horizontal alignment)
 */
export function applyInputBackplateStyle(): CSSRules<{}> {
    return {
        appearance: "none",
        height: "20px",
        width: "20px",
        margin: "0",
        backgroundColor: colors.background800,
        "&:focus, &:hover": {
            outline: "none",
        },
    };
}

export function applySelectInputStyles(): CSSRules<{}> {
    return {
        width: "100%",
        lineHeight: "15px",
        fontSize: "11px",
        backgroundColor: colors.background800,
        borderRadius: "2px",
        appearance: "none",
        outline: "none",
        ...localizePadding(3, 5, 2, 5),
        border: "none",
        color: colors.foreground300,
        "&:-ms-expand": {
            display: "none",
        },
        "& option": {
            background: colors.background300,
        },
        "&:disabled": {
            cursor: "not-allowed",
        },
        "&:focus": {
            ...insetStrongBoxShadow(colors.pink),
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
            borderTop: `3px solid ${colors.foreground300}`,
        },
    };
}

export function applyRemoveItemStyle(): CSSRules<{}> {
    return {
        position: "absolute",
        right: "5px",
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
            ...insetStrongBoxShadow(colors.pink),
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
            background: colors.foreground300,
        },
    };
}

export function applyControlWrapper(): CSSRules<{}> {
    return {
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
        display: "grid",
        width: `calc(100% - 30px)`,
    };
}

export function applySoftRemove(): CSSRules<{}> {
    return {
        display: "flex",
        height: "30px",
        width: "30px",
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
        right: "5px",
        border: "none",
        width: "20px",
        margin: "0",
        height: "20px",
        zIndex: "1",
        borderRadius: "2px",
        "&:focus": {
            ...insetStrongBoxShadow(colors.pink),
            outline: "none",
        },
        "&:checked + svg": {
            fill: colors.foreground000,
        },
        "& + svg": {
            fill: colors.foreground800,
        },
    };
}
