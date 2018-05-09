import { ICSSRules } from "@microsoft/fast-jss-manager";
import { Direction, ellipsis, localizeSpacing, toPx } from "@microsoft/fast-jss-utilities";

export function applyLabelStyle(): ICSSRules<{}> {
    return {
        flexGrow: "1",
        lineHeight: toPx(16),
        fontSize: toPx(14),
        marginRight: toPx(16),
        ...ellipsis()
    };
}

export function applyInputStyle(): ICSSRules<{}> {
    return {
        lineHeight: toPx(16),
        fontSize: toPx(14),
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        borderRadius: toPx(2),
        boxShadow: `inset ${toPx(0)} ${toPx(0)} ${toPx(4)} rgba(0, 0, 0, 0.08)`,
        padding: toPx(8),
        border: "none",
        outline: "none"
    };
}

export function applyWrapperStyle(): ICSSRules<{}> {
    return {
        display: "flex",
        flexDirection: "row",
        paddingTop: toPx(8)
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
            padding: localizeSpacing(Direction.ltr)(`${toPx(12)} ${toPx(30)} ${toPx(12)} ${toPx(12)}`),
            borderBottom: `${toPx(1)} solid rgba(0,0,0,.2)`,
            alignItems: "center",
            position: "relative",
            cursor: "pointer",
            "&:after": {
                position: "absolute",
                content: "''",
                opacity: ".6",
                pointerEvents: "none",
                top: toPx(14),
                width: toPx(16),
                height: toPx(16),
                /* tslint:disable-next-line */
                background: "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNyIgaGVpZ2h0PSIxMSIgdmlld0JveD0iMCAwIDcgMTEiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGcgaWQ9IkNhbnZhcyIgZmlsbD0ibm9uZSI+PGcgaWQ9IiYjMjM4OyYjMTI4OyYjMTQ1OyI+PHBhdGggZD0iTSA1LjUgNy40MjI4NUwgMTAuNDE0NiAyLjUwODNMIDEwLjg5NzkgMi45OTE3TCA1LjUgOC4zODk2NUwgMC4xMDIwNTEgMi45OTE3TCAwLjU4NTQ0OSAyLjUwODNMIDUuNSA3LjQyMjg1WiIgdHJhbnNmb3JtPSJtYXRyaXgoMCAtMSAxIDAgLTIgMTEpIiBmaWxsPSJibGFjayIvPjwvZz48L2c+PC9zdmc+) center no-repeat",
                right: toPx(14),
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
        background: "#EBEBEB",
        zIndex: "1",
        top: toPx(55),
        "& li > button": {
            cursor: "pointer",
            display: "block",
            padding: localizeSpacing(Direction.ltr)(`${toPx(12)} ${toPx(12)} ${toPx(12)} ${toPx(40)}`),
            position: "relative",
            border: "none",
            background: "transparent",
            textAlign: "left",
            "&:before": {
                position: "absolute",
                content: "''",
                opacity: ".6",
                pointerEvents: "none",
                top: toPx(12),
                width: toPx(16),
                height: toPx(16),
                left: toPx(12),
                /* tslint:disable-next-line */
                background: "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxMyAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iQ2FudmFzIiBmaWxsPSJub25lIj48ZyBpZD0iJiMyMzg7JiMxNTk7JiMxMzE7Ij48cGF0aCBkPSJNIDE0IDQuMjg5MDZMIDE0IDE2TCAxIDE2TCAxIDBMIDkuNzEwOTQgMEwgMTQgNC4yODkwNlpNIDEwIDRMIDEyLjI4OTEgNEwgMTAgMS43MTA5NEwgMTAgNFpNIDEzIDE1TCAxMyA1TCA5IDVMIDkgMUwgMiAxTCAyIDE1TCAxMyAxNVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xIDApIiBmaWxsPSJibGFjayIvPjwvZz48L2c+PC9zdmc+) center no-repeat"
            },
            "&:focus": {
                outline: "none"
            }
        }
    };
}

export function applyPopupMenuButtonStyles(): ICSSRules<{}> {
    return {
        background: "none",
        border: "none",
        padding: `${toPx(2)} ${toPx(12)}`,
        color: "#0078D7",
        "&:focus": {
            outline: "none"
        },
        "&:hover": {
            textDecoration: "underline"
        },
        "&[aria-expanded='true']": {
            background: "#EBEBEB",
            borderLeftColor: "rgba(0,0,0,.1)",
            borderRadius: `${toPx(2)} ${toPx(2)} 0 0`,
            borderRightColor: "rgba(0,0,0,.1)",
            borderTopColor: "rgba(0,0,0,.1)",
            color: "black"
        }
    };
}

export function applyPopupHeadingStyles(): ICSSRules<{}> {
    return {
        "& > div": {
            display: "flex",
            borderBottom: `${toPx(1)} solid rgba(0,0,0,.2)`,
            "& h3": {
                flexGrow: "1",
                "& + button": {
                    ...applyPopupMenuButtonStyles()
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
        flexGrow: "1",
        lineHeight: toPx(16),
        fontSize: toPx(14),
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        borderRadius: toPx(2),
        boxShadow: "inset 0px 0px 4px rgba(0, 0, 0, 0.08)",
        appearance: "none",
        padding: localizeSpacing(Direction.ltr)(`${toPx(8)} ${toPx(24)} ${toPx(8)} ${toPx(8)}`),
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
        flexGrow: "1",
        "&:before, &:after": {
            content: "''",
            position: "absolute",
            top: toPx(12),
            zIndex: 1,
            borderRadius: toPx(2),
            width: toPx(1),
            height: toPx(10),
            background: "black"
        },
        "&:before": {
            right: toPx(15),
            transform: "rotate(45deg)"
        },
        "&:after": {
            right: toPx(22),
            transform: "rotate(-45deg)"
        }
    };
}
