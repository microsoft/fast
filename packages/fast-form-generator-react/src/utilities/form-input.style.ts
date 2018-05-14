import { ICSSRules } from "@microsoft/fast-jss-manager";
import { Direction, ellipsis, localizeSpacing, toPx } from "@microsoft/fast-jss-utilities";

export const colors: any = {
    black: "#000",
    white: "#FFF",
    pink: "#FB356D",
    blue: "#0078D4",
    lightBlue: "#0075CF",
    darkBlue: "#005EA6",
    gray: "#8A8A8A",
    grayBackground: "rgba(0, 0, 0, 0.04)",
    boxShadow: "rgba(0, 0, 0, 0.08)",
    border: "rgba(0,0,0,.2)",
    lightBorder: "rgba(0,0,0,.1)",
    menuGray: "#EBEBEB"
};

export function localizePadding(top: number, right: number, bottom: number, left: number): ICSSRules<{}> {
    return {
        padding: localizeSpacing(Direction.ltr)(`${toPx(top)} ${toPx(right)} ${toPx(bottom)} ${toPx(left)}`)
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
    return {
        lineHeight: toPx(16),
        fontSize: toPx(14),
        backgroundColor: colors.grayBackground,
        borderRadius: toPx(2),
        boxShadow: `inset ${toPx(0)} ${toPx(0)} ${toPx(4)} ${colors.boxShadow}`,
        padding: toPx(8),
        border: "none",
        outline: "none"
    };
}

export function applyWrapperStyle(): ICSSRules<{}> {
    return {
        display: "flex",
        flexDirection: "row",
        marginTop: toPx(8)
    };
}

export function applyCleanListStyle(): ICSSRules<{}> {
    return {
        listStyle: "none",
        margin: "0",
        padding: "0"
    };
}

export function applyListItemStyle(): ICSSRules<{}> {
    return {
        "& li": {
            flex: "1 100%",
            borderBottom: `${toPx(1)} solid ${colors.border}`,
            alignItems: "center",
            position: "relative",
            cursor: "pointer",
            "&::after": {
                position: "absolute",
                content: "''",
                opacity: ".6",
                pointerEvents: "none",
                top: toPx(14),
                width: toPx(16),
                height: toPx(16),
                /* tslint:disable-next-line */
                background: "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNyIgaGVpZ2h0PSIxMSIgdmlld0JveD0iMCAwIDcgMTEiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGcgaWQ9IkNhbnZhcyIgZmlsbD0ibm9uZSI+PGcgaWQ9IiYjMjM4OyYjMTI4OyYjMTQ1OyI+PHBhdGggZD0iTSA1LjUgNy40MjI4NUwgMTAuNDE0NiAyLjUwODNMIDEwLjg5NzkgMi45OTE3TCA1LjUgOC4zODk2NUwgMC4xMDIwNTEgMi45OTE3TCAwLjU4NTQ0OSAyLjUwODNMIDUuNSA3LjQyMjg1WiIgdHJhbnNmb3JtPSJtYXRyaXgoMCAtMSAxIDAgLTIgMTEpIiBmaWxsPSJibGFjayIvPjwvZz48L2c+PC9zdmc+) center no-repeat",
                right: "0",
            },
            "& button": {
                width: "100%",
                textAlign: "left",
                ...localizePadding(12, 18, 12, 1)
            },
            "& a": {
                textAlign: "left",
                display: "block",
                ...localizePadding(12, 18, 12, 1),
                "& span": {
                    display: "block",
                    fontStyle: "italic",
                    fontSize: toPx(13),
                    paddingTop: toPx(4)
                }
            }
        }
    };
}

export function applyAriaHiddenStyles(): ICSSRules<{}> {
    return {
        "&[aria-hidden='true']": {
            display: "none"
        },
        "&[aria-hidden='false']": {
            display: "block"
        }
    };
}

export function applyPopupMenuStyles(): ICSSRules<{}> {
    return {
        position: "absolute",
        right: "0",
        width: toPx(200),
        background: colors.menuGray,
        zIndex: "1",
        top: toPx(55),
        boxShadow: `${toPx(0)} ${toPx(1)} ${toPx(0)} ${toPx(0)} ${colors.border}`,
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
                    color: colors.blue,
                    "&:focus": {
                        outline: "none"
                    },
                    "&:hover": {
                        textDecoration: "underline"
                    },
                    "&[aria-expanded='true']": {
                        background: colors.menuGray,
                        borderLeftColor: colors.lightBorder,
                        borderRadius: `${toPx(2)} ${toPx(2)} 0 0`,
                        borderRightColor: colors.lightBorder,
                        borderTopColor: colors.lightBorder,
                        color: colors.black,
                        "&:hover": {
                            textDecoration: "none"
                        }
                    }
                }
            }
        }
    };
}

export function applyInputBackplateStyle(): ICSSRules<{}> {
    return {
        appearance: "none",
        height: toPx(36),
        width: toPx(36),
        backgroundColor: "transparent",
        "&:focus": {
            outline: "none",
        }
    };
}

export function applySelectInputStyles(): ICSSRules<{}> {
    return {
        width: "100%",
        lineHeight: toPx(16),
        fontSize: toPx(14),
        backgroundColor: colors.grayBackground,
        borderRadius: toPx(2),
        boxShadow: `inset ${toPx(0)} ${toPx(0)} ${toPx(4)} ${colors.boxShadow}`,
        appearance: "none",
        ...localizePadding(8, 36, 8, 10),
        border: "none",
        outline: "none",
        "&:-ms-expand": {
            display: "none"
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
