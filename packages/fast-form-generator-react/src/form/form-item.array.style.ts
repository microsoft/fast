import { ellipsis, toPx } from "@microsoft/fast-jss-utilities";
import {
    applyAriaHiddenStyles,
    applyCleanListStyle,
    applyPopupMenuButtonStyles,
    applyPopupMenuStyles,
} from "../utilities/form-input.shared-style.style";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IFormItemArrayClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<IFormItemArrayClassNameContract, {}> = {
    formItemArray: {
        position: "relative",
        "& button": {
            lineHeight: "1",
            fontSize: toPx(14),
            cursor: "pointer",
            background: "transparent",
            border: "none",
            padding: `${toPx(4)}`,
            color: "#0078D7",
            "&:focus": {
                outline: "none"
            }
        },
        "& label": {
            lineHeight: toPx(16),
            fontSize: toPx(14)
        },
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
    },
    formItemArray_menu: {
        ...applyCleanListStyle(),
        ...applyAriaHiddenStyles(),
        ...applyPopupMenuStyles(),
        "& li": {
            flex: "1 100%",
            padding: `${toPx(12)} 0`
        }
    },
    formItemArray_linkMenu: {
        ...applyCleanListStyle(),
        "& li": {
            flex: "1 100%",
            padding: "12px 48px",
            borderBottom: `${toPx(1)} solid rgba(0,0,0,.2)`,
            alignItems: "center",
            position: "relative",
            "&:before, &:after": {
                position: "absolute",
                content: "''",
                opacity: ".6",
                pointerEvents: "none",
                top: toPx(14),
                width: toPx(16),
                height: toPx(16)
            },
            "&:before": {
                /* tslint:disable-next-line */
                background: "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDE2IDkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGcgaWQ9IkNhbnZhcyIgZmlsbD0ibm9uZSI+PGcgaWQ9IiYjMjM4OyYjMTU2OyYjMTI4OyI+PHBhdGggZD0iTSAxNiA1TCAwIDVMIDAgNEwgMTYgNEwgMTYgNVpNIDE2IDEzTCAwIDEzTCAwIDEyTCAxNiAxMkwgMTYgMTNaTSAxNiA4Ljk5MjE5TCAwIDguOTkyMTlMIDAgOEwgMTYgOEwgMTYgOC45OTIxOVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTQpIiBmaWxsPSJibGFjayIvPjwvZz48L2c+PC9zdmc+) center no-repeat",
                left: toPx(14),
            },
            "&:after": {
                /* tslint:disable-next-line */
                background: "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNyIgaGVpZ2h0PSIxMSIgdmlld0JveD0iMCAwIDcgMTEiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGcgaWQ9IkNhbnZhcyIgZmlsbD0ibm9uZSI+PGcgaWQ9IiYjMjM4OyYjMTI4OyYjMTQ1OyI+PHBhdGggZD0iTSA1LjUgNy40MjI4NUwgMTAuNDE0NiAyLjUwODNMIDEwLjg5NzkgMi45OTE3TCA1LjUgOC4zODk2NUwgMC4xMDIwNTEgMi45OTE3TCAwLjU4NTQ0OSAyLjUwODNMIDUuNSA3LjQyMjg1WiIgdHJhbnNmb3JtPSJtYXRyaXgoMCAtMSAxIDAgLTIgMTEpIiBmaWxsPSJibGFjayIvPjwvZz48L2c+PC9zdmc+) center no-repeat",
                right: toPx(14),
            }
        }
    }
};

export default styles;
