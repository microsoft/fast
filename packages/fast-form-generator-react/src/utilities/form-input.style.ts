import { CSSRules } from "@microsoft/fast-jss-manager";
import {
    Direction,
    ellipsis,
    localizeSpacing,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { relative } from "path";

/**
 * Base64 encoded svgs
 */
/* tslint:disable */
export const rightArrow: string =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNyIgaGVpZ2h0PSIxMSIgdmlld0JveD0iMCAwIDcgMTEiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGcgaWQ9IkNhbnZhcyIgZmlsbD0ibm9uZSI+PGcgaWQ9IiYjMjM4OyYjMTI4OyYjMTQ1OyI+PHBhdGggZD0iTSA1LjUgNy40MjI4NUwgMTAuNDE0NiAyLjUwODNMIDEwLjg5NzkgMi45OTE3TCA1LjUgOC4zODk2NUwgMC4xMDIwNTEgMi45OTE3TCAwLjU4NTQ0OSAyLjUwODNMIDUuNSA3LjQyMjg1WiIgdHJhbnNmb3JtPSJtYXRyaXgoMCAtMSAxIDAgLTIgMTEpIiBmaWxsPSJibGFjayIvPjwvZz48L2c+PC9zdmc+) center no-repeat";
export const lines: string =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDE2IDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE2IDVIMFY0SDE2VjVaTTE2IDEzSDBWMTJIMTZWMTNaTTE2IDguOTkyMTlIMFY4SDE2VjguOTkyMTlaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC00LjAwMDAzKSIgZmlsbD0iYmxhY2siLz48L3N2Zz4=) center no-repeat";
export const plus: string =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTYgNFYwSDRWNEgwVjZINFYxMEg2VjZIMTBWNEg2WiIgZmlsbD0iI0YyRjJGMiIvPgo8cGF0aCBkPSJNNiA0VjBINFY0SDBWNkg0VjEwSDZWNkgxMFY0SDZaIiBmaWxsPSIjRjJGMkYyIi8+CjxwYXRoIGQ9Ik02IDRWMEg0VjRIMFY2SDRWMTBINlY2SDEwVjRINloiIGZpbGw9IiNGMkYyRjIiLz4KPC9zdmc+Cg==) center no-repeat";
export const minus: string =
    "url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHRpdGxlPm1pbnVzVXBkYXRlZDwvdGl0bGU+PGc+PHBhdGggZD0iTTE2LDguNUgwdi0xaDE2VjguNXoiLz48L2c+PC9zdmc+) center no-repeat";
export const lightTheme: string =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNCAxNSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iQ2FudmFzIiBmaWxsPSJub25lIj48ZyBpZD0iQSI+PHBhdGggZD0iTSAxMy45MTYgMjJMIDEwLjQ3ODUgMjJMIDkuNDgyNDIgMTguODg0OEwgNC41MDE5NSAxOC44ODQ4TCAzLjUxNTYyIDIyTCAwLjA5NzY1NjIgMjJMIDUuMTk1MzEgNy45OTYwOUwgOC45MzU1NSA3Ljk5NjA5TCAxMy45MTYgMjJaTSA4Ljc1OTc3IDE2LjQ2MjlMIDcuMjU1ODYgMTEuNzU1OUMgNy4xNDUxOCAxMS40MDQzIDcuMDY3MDYgMTAuOTg0NCA3LjAyMTQ4IDEwLjQ5NjFMIDYuOTQzMzYgMTAuNDk2MUMgNi45MTA4MSAxMC45MDYyIDYuODI5NDMgMTEuMzEzMiA2LjY5OTIyIDExLjcxNjhMIDUuMTc1NzggMTYuNDYyOUwgOC43NTk3NyAxNi40NjI5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNykiIGZpbGw9ImJsYWNrIi8+PC9nPjwvZz48L3N2Zz4=) center no-repeat";
export const darkTheme: string =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNCAxNSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iQ2FudmFzIiBmaWxsPSJub25lIj48ZyBpZD0iQSI+PHBhdGggZD0iTSAxMy45MTYgMjJMIDEwLjQ3ODUgMjJMIDkuNDgyNDIgMTguODg0OEwgNC41MDE5NSAxOC44ODQ4TCAzLjUxNTYyIDIyTCAwLjA5NzY1NjIgMjJMIDUuMTk1MzEgNy45OTYwOUwgOC45MzU1NSA3Ljk5NjA5TCAxMy45MTYgMjJaTSA4Ljc1OTc3IDE2LjQ2MjlMIDcuMjU1ODYgMTEuNzU1OUMgNy4xNDUxOCAxMS40MDQzIDcuMDY3MDYgMTAuOTg0NCA3LjAyMTQ4IDEwLjQ5NjFMIDYuOTQzMzYgMTAuNDk2MUMgNi45MTA4MSAxMC45MDYyIDYuODI5NDMgMTEuMzEzMiA2LjY5OTIyIDExLjcxNjhMIDUuMTc1NzggMTYuNDYyOUwgOC43NTk3NyAxNi40NjI5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNykiIGZpbGw9IndoaXRlIi8+PC9nPjwvZz48L3N2Zz4=) center no-repeat";
export const trashcan: string =
    "url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHRpdGxlPnRyYXNoY2FuVVBEQVRFRDwvdGl0bGU+PGc+PHBhdGggZD0iTTE0LjMsMy4yaC0xdjExLjRjMCwwLjgtMC43LDEuNS0xLjUsMS41YzAsMCwwLDAsMCwwSDRjLTAuNCwwLTAuOC0wLjItMS0wLjRjLTAuMy0wLjMtMC40LTAuNy0wLjQtMVYzLjJoLTF2LTFoMy45di0xYzAtMC4xLDAtMC4zLDAuMS0wLjRjMC0wLjEsMC4xLTAuMiwwLjItMC4zQzUuOCwwLjQsNiwwLjMsNi4xLDAuM2MwLjEtMC4xLDAuMy0wLjEsMC40LTAuMWgzYzAuMSwwLDAuMywwLDAuNCwwLjFjMC4xLDAuMSwwLjIsMC4xLDAuMywwLjJjMC4xLDAuMSwwLjIsMC4yLDAuMiwwLjNjMC4xLDAuMSwwLjEsMC4zLDAuMSwwLjR2MWgzLjlMMTQuMywzLjJ6IE0xMi40LDMuMkgzLjV2MTEuNGMwLDAuMSwwLjEsMC4zLDAuMSwwLjNDMy43LDE1LDMuOSwxNSw0LDE1aDcuOWMwLjEsMCwwLjMtMC4xLDAuMy0wLjFjMC4xLTAuMSwwLjEtMC4yLDAuMS0wLjNMMTIuNCwzLjJ6IE02LjUsMTNoLTFWNS4xaDFMNi41LDEzeiBNNi41LDIuMmgzdi0xaC0zVjIuMnogTTguNCwxM2gtMVY1LjFoMVYxM3ogTTEwLjQsMTNoLTFWNS4xaDFMMTAuNCwxM3oiLz48L2c+PC9zdmc+) center no-repeat";
/* tslint:enable */

export interface BoxShadowConfig {
    offsetX: number;
    offsetY: number;
    blurRadius: number;
    spreadRadius: number;
    color: string;
    inset?: boolean;
}

export const colors: any = {
    black: "#000",
    white: "#F2F2F2",
    blue: "#0078D4",
    pink: "#FB356D",
    lightPink: "#FB4E7F",
    darkPink: "#FB1C5B",
    gray: "#8A8A8A",
    grayBackground: "rgba(255, 255, 255, 0.1)",
    containerBackground: "rgb(244, 245, 246)",
    boxShadow: "rgba(0, 0, 0, 0.08)",
    hover: "rgba(0,0,0, .3)",
    border: "rgba(255,255,255, .2)",
    lightBorder: "rgba(0,0,0, .1)",
    menuGray: "#EBEBEB",
};

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

export function insetHoverBoxShadow(): CSSRules<{}> {
    const shadow: BoxShadowConfig = {
        offsetX: 0,
        offsetY: 0,
        blurRadius: 2,
        spreadRadius: 0,
        color: colors.hover,
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
        ...ellipsis(),
    };
}

export function applyInputContainerStyle(): CSSRules<{}> {
    return {
        height: toPx(36),
        marginTop: toPx(8),
    };
}

export function applyInputStyle(): CSSRules<{}> {
    return {
        lineHeight: "15px",
        fontSize: "11px",
        backgroundColor: colors.grayBackground,
        borderRadius: "2px",
        ...localizePadding(2, 5, 3, 5),
        border: "none",
        outline: "none",
        boxSizing: "border-box",
        color: "#F2F2F2",
        "&:disabled": {
            color: "rgba(255, 255, 255, 0.7)",
            cursor: "not-allowed",
        },
        "&:focus": {
            ...insetStrongBoxShadow(colors.pink),
        },
    };
}

export function applyWrapperStyle(): CSSRules<{}> {
    return {
        display: "flex",
        flexDirection: "row",
        minHeight: "30px",
        alignItems: "center",
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

export function applyHeaderStyle(): CSSRules<{}> {
    return {
        display: "flex",
        alignItems: "center",
        padding: `${toPx(20)} 0 0 0`,
        minHeight: toPx(40),
        "& h3": {
            margin: toPx(0),
        },
    };
}

export function applyGlobalStyle(): CSSRules<{}> {
    return {
        'body > li[draggable="true"]': {
            boxShadow: `0 ${toPx(4)} ${toPx(4)} ${toPx(-4)} rgba(0, 0, 0, 0.15)`,
            borderColor: "transparent",
            listStyleType: "none",
            listStyle: "none",
            background: colors.containerBackground,
        },
    };
}

export function applyListItemStyle(): CSSRules<{}> {
    return {
        "& li": listItem,
    };
}

export const listItem: CSSRules<{}> = {
    flex: "1 100%",
    borderBottom: `${toPx(1)} solid ${colors.border}`,
    alignItems: "center",
    position: "relative",
    cursor: "pointer",
    display: "flex",
    height: toPx(40),
    background: colors.containerBackground,
    "&::after, &::before": {
        position: "absolute",
        content: "''",
        opacity: ".6",
        pointerEvents: "none",
        top: toPx(13),
        width: toPx(16),
        height: toPx(16),
    },
    "&::after": {
        background: rightArrow,
        right: "0",
    },
    "&::before": {
        background: lines,
        left: "0",
    },
    "& button": {
        fontSize: toPx(14),
        border: "none",
        background: "transparent",
        textAlign: "left",
        marginLeft: toPx(25),
        ...localizePadding(12, 18, 12, 1),
    },
    "& a": {
        textAlign: "left",
        display: "block",
        minHeight: toPx(19),
        width: "100%",
        ...localizePadding(12, 0, 12, 26),
        "& span": {
            display: "block",
            fontStyle: "italic",
            fontSize: toPx(13),
            paddingTop: toPx(4),
        },
    },
};

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

export function applyPopupMenuStyles(): CSSRules<{}> {
    const shadow: BoxShadowConfig = {
        offsetX: 0,
        offsetY: 1,
        blurRadius: 0,
        spreadRadius: 0,
        color: colors.border,
    };

    return {
        position: "absolute",
        right: "0",
        width: toPx(200),
        background: colors.menuGray,
        zIndex: "1",
        top: toPx(65),
        ...boxShadow(shadow),
        "& li": {
            "& > button": {
                cursor: "pointer",
                display: "block",
                ...localizePadding(12, 12, 12, 36),
                position: "relative",
                border: "none",
                background: "transparent",
                textAlign: "left",
                width: "100%",
                ...ellipsis(),
                lineHeight: toPx(16),
                "&:focus": {
                    outline: "none",
                },
                "&:hover": {
                    backgroundColor: colors.grayBackground,
                },
            },
            "& > span": {
                display: "block",
                padding: toPx(12),
            },
        },
    };
}

/**
 * As opposed to text-decoration: underline
 */
export const thickLine: CSSRules<{}> = {
    "& > span": {
        position: "relative",
        paddingBottom: toPx(3),
        display: "block",
        ...ellipsis(),
    },
    "&:hover, &:focus": {
        outline: "none",
        "& > span": {
            "&::after": {
                position: "absolute",
                content: "''",
                pointerEvents: "none",
                display: "block",
                background: colors.pink,
                width: "100%",
                height: toPx(2),
                bottom: "0",
            },
        },
    },
};

export function applyPopupHeadingStyles(): CSSRules<{}> {
    return {
        position: "relative",
        "& > div": {
            display: "flex",
            borderBottom: `${toPx(1)} solid ${colors.border}`,
            "& h3": {
                flexGrow: "1",
                "& + button": {
                    fontSize: toPx(14),
                    background: "none",
                    border: "none",
                    padding: `${toPx(14)} ${toPx(12)}`,
                    color: colors.pink,
                    ...thickLine,
                    "&:hover": {
                        cursor: "pointer",
                    },
                    '&[aria-expanded="true"]': {
                        background: colors.menuGray,
                        borderLeftColor: colors.lightBorder,
                        borderRadius: `${toPx(2)} ${toPx(2)} 0 0`,
                        borderRightColor: colors.lightBorder,
                        borderTopColor: colors.lightBorder,
                        color: colors.black,
                        "&:hover, &:focus": {
                            "& > span::after": {
                                display: "none",
                            },
                        },
                        "& > span::after": {
                            display: "none",
                        },
                    },
                },
            },
        },
    };
}

/**
 * Used for styles radio buttons (vertical and horizontal alignment)
 */
export function applyInputBackplateStyle(): CSSRules<{}> {
    const shadow: BoxShadowConfig = {
        offsetX: 0,
        offsetY: 0,
        blurRadius: 0,
        spreadRadius: 2,
        color: colors.black,
        inset: true,
    };

    return {
        appearance: "none",
        height: toPx(36),
        width: toPx(36),
        margin: toPx(0),
        borderRadius: toPx(2),
        backgroundColor: "transparent",
        "&:focus, &:hover": {
            outline: "none",
            ...boxShadow(shadow),
        },
    };
}

export function applySelectInputStyles(): CSSRules<{}> {
    return {
        width: "100%",
        lineHeight: "15px",
        fontSize: "11px",
        backgroundColor: colors.grayBackground,
        borderRadius: "2px",
        appearance: "none",
        outline: "none",
        ...localizePadding(2, 5, 3, 5),
        border: "none",
        color: "#F2F2F2",
        "&:-ms-expand": {
            display: "none",
        },
        "& option": {
            background: "#212121",
        },
        "&:disabled": {
            color: "rgba(255, 255, 255, 0.7)",
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
            borderTop: "3px solid #F2F2F2",
        },
    };
}

export function applyAddItemStyle(): CSSRules<{}> {
    return {
        position: "relative",
        color: colors.pink,
        cursor: "pointer",
        border: "none",
        background: "transparent",
        lineHeight: toPx(16),
        fontSize: toPx(14),
        maxWidth: toPx(290),
        minHeight: toPx(40),
        "&::before": {
            position: "absolute",
            content: "''",
            pointerEvents: "none",
            background: plus,
            width: toPx(16),
            height: toPx(16),
            left: "0",
            top: "50%",
            transform: "translateY(-50%)",
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
            background: "#F2F2F2",
        },
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
            fill: "#FFFFFF",
        },
        "& + svg": {
            fill: "#AAAAAA",
        },
    };
}
