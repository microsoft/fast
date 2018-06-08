import { ICSSRules } from "@microsoft/fast-jss-manager";
import { Direction, ellipsis, localizeSpacing, toPx } from "@microsoft/fast-jss-utilities";

/**
 * Base64 encoded svgs
 */
/* tslint:disable */
export const rightArrow: string = "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNyIgaGVpZ2h0PSIxMSIgdmlld0JveD0iMCAwIDcgMTEiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGcgaWQ9IkNhbnZhcyIgZmlsbD0ibm9uZSI+PGcgaWQ9IiYjMjM4OyYjMTI4OyYjMTQ1OyI+PHBhdGggZD0iTSA1LjUgNy40MjI4NUwgMTAuNDE0NiAyLjUwODNMIDEwLjg5NzkgMi45OTE3TCA1LjUgOC4zODk2NUwgMC4xMDIwNTEgMi45OTE3TCAwLjU4NTQ0OSAyLjUwODNMIDUuNSA3LjQyMjg1WiIgdHJhbnNmb3JtPSJtYXRyaXgoMCAtMSAxIDAgLTIgMTEpIiBmaWxsPSJibGFjayIvPjwvZz48L2c+PC9zdmc+) center no-repeat";
export const lines: string = "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDE2IDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE2IDVIMFY0SDE2VjVaTTE2IDEzSDBWMTJIMTZWMTNaTTE2IDguOTkyMTlIMFY4SDE2VjguOTkyMTlaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC00LjAwMDAzKSIgZmlsbD0iYmxhY2siLz48L3N2Zz4=) center no-repeat";
export const plus: string = "url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHRpdGxlPnBsdXNVUERBVEVEPC90aXRsZT48Zz48cGF0aCBkPSJNMTYsNy41djFIOC41VjE2aC0xVjguNUgwdi0xaDcuNVYwaDF2Ny41SDE2eiIvPjwvZz48L3N2Zz4=) center no-repeat";
export const pinkPlus: string = "url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4uc3Qwe2ZpbGw6I0ZCMzU2RDt9PC9zdHlsZT48dGl0bGU+cGx1c1VQREFURUQ8L3RpdGxlPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xNiw3LjV2MUg4LjVWMTZoLTFWOC41SDB2LTFoNy41VjBoMXY3LjVIMTZ6Ii8+PC9nPjwvc3ZnPg==) center no-repeat";
export const minus: string = "url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHRpdGxlPm1pbnVzVXBkYXRlZDwvdGl0bGU+PGc+PHBhdGggZD0iTTE2LDguNUgwdi0xaDE2VjguNXoiLz48L2c+PC9zdmc+) center no-repeat";
export const lightTheme: string = "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNCAxNSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iQ2FudmFzIiBmaWxsPSJub25lIj48ZyBpZD0iQSI+PHBhdGggZD0iTSAxMy45MTYgMjJMIDEwLjQ3ODUgMjJMIDkuNDgyNDIgMTguODg0OEwgNC41MDE5NSAxOC44ODQ4TCAzLjUxNTYyIDIyTCAwLjA5NzY1NjIgMjJMIDUuMTk1MzEgNy45OTYwOUwgOC45MzU1NSA3Ljk5NjA5TCAxMy45MTYgMjJaTSA4Ljc1OTc3IDE2LjQ2MjlMIDcuMjU1ODYgMTEuNzU1OUMgNy4xNDUxOCAxMS40MDQzIDcuMDY3MDYgMTAuOTg0NCA3LjAyMTQ4IDEwLjQ5NjFMIDYuOTQzMzYgMTAuNDk2MUMgNi45MTA4MSAxMC45MDYyIDYuODI5NDMgMTEuMzEzMiA2LjY5OTIyIDExLjcxNjhMIDUuMTc1NzggMTYuNDYyOUwgOC43NTk3NyAxNi40NjI5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNykiIGZpbGw9ImJsYWNrIi8+PC9nPjwvZz48L3N2Zz4=) center no-repeat";
export const darkTheme: string = "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNCAxNSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iQ2FudmFzIiBmaWxsPSJub25lIj48ZyBpZD0iQSI+PHBhdGggZD0iTSAxMy45MTYgMjJMIDEwLjQ3ODUgMjJMIDkuNDgyNDIgMTguODg0OEwgNC41MDE5NSAxOC44ODQ4TCAzLjUxNTYyIDIyTCAwLjA5NzY1NjIgMjJMIDUuMTk1MzEgNy45OTYwOUwgOC45MzU1NSA3Ljk5NjA5TCAxMy45MTYgMjJaTSA4Ljc1OTc3IDE2LjQ2MjlMIDcuMjU1ODYgMTEuNzU1OUMgNy4xNDUxOCAxMS40MDQzIDcuMDY3MDYgMTAuOTg0NCA3LjAyMTQ4IDEwLjQ5NjFMIDYuOTQzMzYgMTAuNDk2MUMgNi45MTA4MSAxMC45MDYyIDYuODI5NDMgMTEuMzEzMiA2LjY5OTIyIDExLjcxNjhMIDUuMTc1NzggMTYuNDYyOUwgOC43NTk3NyAxNi40NjI5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNykiIGZpbGw9IndoaXRlIi8+PC9nPjwvZz48L3N2Zz4=) center no-repeat";
export const trashcan: string = "url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHRpdGxlPnRyYXNoY2FuVVBEQVRFRDwvdGl0bGU+PGc+PHBhdGggZD0iTTE0LjMsMy4yaC0xdjExLjRjMCwwLjgtMC43LDEuNS0xLjUsMS41YzAsMCwwLDAsMCwwSDRjLTAuNCwwLTAuOC0wLjItMS0wLjRjLTAuMy0wLjMtMC40LTAuNy0wLjQtMVYzLjJoLTF2LTFoMy45di0xYzAtMC4xLDAtMC4zLDAuMS0wLjRjMC0wLjEsMC4xLTAuMiwwLjItMC4zQzUuOCwwLjQsNiwwLjMsNi4xLDAuM2MwLjEtMC4xLDAuMy0wLjEsMC40LTAuMWgzYzAuMSwwLDAuMywwLDAuNCwwLjFjMC4xLDAuMSwwLjIsMC4xLDAuMywwLjJjMC4xLDAuMSwwLjIsMC4yLDAuMiwwLjNjMC4xLDAuMSwwLjEsMC4zLDAuMSwwLjR2MWgzLjlMMTQuMywzLjJ6IE0xMi40LDMuMkgzLjV2MTEuNGMwLDAuMSwwLjEsMC4zLDAuMSwwLjNDMy43LDE1LDMuOSwxNSw0LDE1aDcuOWMwLjEsMCwwLjMtMC4xLDAuMy0wLjFjMC4xLTAuMSwwLjEtMC4yLDAuMS0wLjNMMTIuNCwzLjJ6IE02LjUsMTNoLTFWNS4xaDFMNi41LDEzeiBNNi41LDIuMmgzdi0xaC0zVjIuMnogTTguNCwxM2gtMVY1LjFoMVYxM3ogTTEwLjQsMTNoLTFWNS4xaDFMMTAuNCwxM3oiLz48L2c+PC9zdmc+) center no-repeat";
/* tslint:enable */

export interface IBoxShadowConfig {
    offsetX: number;
    offsetY: number;
    blurRadius: number;
    spreadRadius: number;
    color: string;
    inset?: boolean;
}

export const colors: any = {
    black: "#000",
    white: "#FFF",
    blue: "#0078D4",
    pink: "#FB356D",
    lightPink: "#FB4E7F",
    darkPink: "#FB1C5B",
    gray: "#8A8A8A",
    grayBackground: "rgba(0, 0, 0, 0.04)",
    containerBackground: "rgb(244, 245, 246)",
    boxShadow: "rgba(0, 0, 0, 0.08)",
    hover: "rgba(0,0,0, .3)",
    border: "rgba(0,0,0, .2)",
    lightBorder: "rgba(0,0,0, .1)",
    menuGray: "#EBEBEB"
};

export function localizePadding(top: number, right: number, bottom: number, left: number): ICSSRules<{}> {
    return {
        padding: localizeSpacing(Direction.ltr)(`${toPx(top)} ${toPx(right)} ${toPx(bottom)} ${toPx(left)}`)
    };
}

export function boxShadow(config: IBoxShadowConfig): ICSSRules<{}> {
    return {
        boxShadow: `${config.inset ? "inset " : ""}
        ${toPx(config.offsetX)} ${toPx(config.offsetY)} ${toPx(config.blurRadius)} ${toPx(config.spreadRadius)} ${config.color}`
    };
}

/**
 * Mimics a border but with boxShadow (strong in the sense of no blur)
 */
export function insetStrongBoxShadow(color: string): ICSSRules<{}> {
    const shadow: IBoxShadowConfig = {
        offsetX: 0,
        offsetY: 0,
        blurRadius: 0,
        spreadRadius: 1,
        color,
        inset: true
    };

    return {
        ...boxShadow(shadow)
    };
}

export function insetHoverBoxShadow(): ICSSRules<{}> {
    const shadow: IBoxShadowConfig = {
        offsetX: 0,
        offsetY: 0,
        blurRadius: 2,
        spreadRadius: 0,
        color: colors.hover,
        inset: true
    };

    return {
        ...boxShadow(shadow)
    };
}

export function applyLabelStyle(): ICSSRules<{}> {
    return {
        flexGrow: "1",
        lineHeight: toPx(16),
        fontSize: toPx(14),
        marginRight: toPx(16),
        paddingTop: toPx(6),
        ...ellipsis()
    };
}

export function applyInputStyle(): ICSSRules<{}> {
    const shadow: IBoxShadowConfig = {
        offsetX: 0,
        offsetY: 0,
        blurRadius: 4,
        spreadRadius: 0,
        color: colors.boxShadow,
        inset: true
    };

    return {
        lineHeight: toPx(16),
        fontSize: toPx(14),
        backgroundColor: colors.grayBackground,
        borderRadius: toPx(2),
        ...boxShadow(shadow),
        padding: toPx(8),
        border: "none",
        outline: "none",
        "&:hover": {
            ...insetHoverBoxShadow()
        },
        "&:focus": {
            ...insetStrongBoxShadow(colors.pink)
        }
    };
}

export function applyWrapperStyle(): ICSSRules<{}> {
    return {
        display: "flex",
        flexDirection: "row",
        marginTop: toPx(8)
    };
}

/**
 * Common wrapper that surrounds a label and an input
 */
export function applyCleanListStyle(): ICSSRules<{}> {
    return {
        listStyle: "none",
        margin: "0",
        padding: "0",
        listStylePosition: "outside"
    };
}

export function applyGlobalStyle(): ICSSRules<{}> {
    return {
        "body > li[draggable=\"true\"]": {
            ...listItem,
            ...draggingStyles
        }
    };
}

export function applyListItemStyle(): ICSSRules<{}> {
    return {
        "& li": listItem
    };
}

export const draggingStyles: ICSSRules<{}> = {
    boxShadow: `0 ${toPx(4)} ${toPx(4)} ${toPx(-4)} rgba(0, 0, 0, 0.15)`,
    borderColor: "transparent",
    display: "flex",
    "&::after": {
        background: rightArrow,
        right: toPx(0)
    },
    "&::before": {
        background: lines,
        left: toPx(0)
    }
};

export const listItem: ICSSRules<{}> = {
    flex: "1 100%",
    borderBottom: `${toPx(1)} solid ${colors.border}`,
    alignItems: "center",
    position: "relative",
    cursor: "pointer",
    background: colors.containerBackground,
    "&::after, &::before": {
        position: "absolute",
        content: "''",
        opacity: ".6",
        pointerEvents: "none",
        top: toPx(13),
        width: toPx(16),
        height: toPx(16)
    },
    "&::after": {
        background: rightArrow,
        right: "0"
    },
    "&::before": {
        background: lines,
        left: "0"
    },
    "& button": {
        fontSize: toPx(14),
        border: "none",
        background: "transparent",
        textAlign: "left",
        marginLeft: toPx(25),
        ...localizePadding(12, 18, 12, 1)
    },
    "& a": {
        textAlign: "left",
        display: "block",
        minHeight: toPx(19),
        ...localizePadding(12, 18, 12, 26),
        "& span": {
            display: "block",
            fontStyle: "italic",
            fontSize: toPx(13),
            paddingTop: toPx(4)
        }
    }
};

export function applyAriaHiddenStyles(): ICSSRules<{}> {
    return {
        "&[aria-hidden=\"true\"]": {
            display: "none"
        },
        "&[aria-hidden=\"false\"]": {
            display: "block"
        }
    };
}

export function applyPopupMenuStyles(): ICSSRules<{}> {
    const shadow: IBoxShadowConfig = {
        offsetX: 0,
        offsetY: 1,
        blurRadius: 0,
        spreadRadius: 0,
        color: colors.border
    };

    return {
        position: "absolute",
        right: "0",
        width: toPx(200),
        background: colors.menuGray,
        zIndex: "1",
        top: toPx(55),
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
                    outline: "none"
                },
                "&:hover": {
                    backgroundColor: colors.grayBackground
                }
            },
            "& > span": {
                display: "block",
                padding: toPx(12)
            }
        }
    };
}

/**
 * As opposed to text-decoration: underline
 */
export const thickLine: ICSSRules<{}> = {
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
                bottom: "0"
            }
        }
    }
};

export function applyPopupHeadingStyles(): ICSSRules<{}> {
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
                    padding: `${toPx(2)} ${toPx(12)}`,
                    color: colors.pink,
                    ...thickLine,
                    "&[aria-expanded=\"true\"]": {
                        background: colors.menuGray,
                        borderLeftColor: colors.lightBorder,
                        borderRadius: `${toPx(2)} ${toPx(2)} 0 0`,
                        borderRightColor: colors.lightBorder,
                        borderTopColor: colors.lightBorder,
                        color: colors.black,
                        "&:hover, &:focus": {
                            "& > span::after": {
                                display: "none"
                            }
                        },
                        "& > span::after": {
                            display: "none"
                        }
                    }
                }
            }
        }
    };
}

/**
 * Used for styles radio buttons (vertical and horizontal alignment)
 */
export function applyInputBackplateStyle(): ICSSRules<{}> {
    const shadow: IBoxShadowConfig = {
        offsetX: 0,
        offsetY: 0,
        blurRadius: 0,
        spreadRadius: 2,
        color: colors.black,
        inset: true
    };

    return {
        appearance: "none",
        height: toPx(36),
        width: toPx(36),
        backgroundColor: "transparent",
        "&:focus, &:hover": {
            outline: "none",
            ...boxShadow(shadow)
        }
    };
}

export function applySelectInputStyles(): ICSSRules<{}> {
    const shadow: IBoxShadowConfig = {
        offsetX: 0,
        offsetY: 0,
        blurRadius: 4,
        spreadRadius: 0,
        color: colors.boxShadow,
        inset: true
    };

    return {
        width: "100%",
        lineHeight: toPx(16),
        fontSize: toPx(14),
        backgroundColor: colors.grayBackground,
        borderRadius: toPx(2),
        ...boxShadow(shadow),
        appearance: "none",
        ...localizePadding(8, 36, 8, 10),
        border: "none",
        outline: "none",
        "&:-ms-expand": {
            display: "none"
        },
        "&:hover": {
            ...insetHoverBoxShadow()
        },
        "&:focus": {
            ...insetStrongBoxShadow(colors.pink)
        }
    };
}

export function applySelectSpanStyles(): ICSSRules<{}> {
    return {
        position: "relative",
        display: "flex",
        "&::before, &::after": {
            content: "''",
            position: "absolute",
            top: toPx(12),
            zIndex: "1",
            borderRadius: toPx(2),
            width: toPx(1),
            height: toPx(10),
            background: colors.black
        },
        "&::before": {
            right: toPx(15),
            transform: "rotate(45deg)"
        },
        "&::after": {
            right: toPx(22),
            transform: "rotate(-45deg)"
        }
    };
}

export function applyAddItemStyle(): ICSSRules<{}> {
    return {
        position: "relative",
        color: colors.pink,
        cursor: "pointer",
        border: "none",
        background: "transparent",
        lineHeight: toPx(16),
        fontSize: toPx(14),
        maxWidth: toPx(290),
        "&::before": {
            position: "absolute",
            content: "''",
            pointerEvents: "none",
            background: pinkPlus,
            width: toPx(16),
            height: toPx(16),
            left: "0"
        }
    };
}
