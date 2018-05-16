import { ellipsis, toPx } from "@microsoft/fast-jss-utilities";
import {
    applyAriaHiddenStyles,
    applyCleanListStyle,
    applyGlobalStyle,
    applyListItemStyle,
    applyPopupHeadingStyles,
    applyPopupMenuStyles,
    colors,
    localizePadding
} from "../utilities/form-input.style";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IFormItemArrayClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<IFormItemArrayClassNameContract, {}> = {
    "@global": {
        ...applyGlobalStyle()
    },
    formItemArray: {
        ...applyPopupHeadingStyles(),
        marginTop: toPx(8),
        "& button": {
            lineHeight: "1",
            fontSize: toPx(14),
            cursor: "pointer",
            background: "transparent",
            border: "none",
            padding: `${toPx(4)}`,
            "&:focus": {
                outline: "none"
            }
        }
    },
    formItemArray_actionMenu: {
        ...applyCleanListStyle(),
        ...applyAriaHiddenStyles(),
        ...applyPopupMenuStyles(),
        "& $formItemArray_actionMenuItem__add, & $formItemArray_actionMenuItem__remove": {
                ...localizePadding(12, 12, 12, 36),
                width: "100%",
                ...ellipsis(),
                textAlign: "left",
                color: colors.black,
                "&::before": {
                    position: "absolute",
                    content: "''",
                    opacity: ".6",
                    pointerEvents: "none",
                    width: toPx(16),
                    height: toPx(16),
                    left: toPx(10)
                },
                "&:hover": {
                    backgroundColor: colors.grayBackground
                }
            }
    },
    formItemArray_actionMenuItem__add: {
        "&::before": {
             /* tslint:disable-next-line */
            background: "url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHRpdGxlPnBsdXNVUERBVEVEPC90aXRsZT48Zz48cGF0aCBkPSJNMTYsNy41djFIOC41VjE2aC0xVjguNUgwdi0xaDcuNVYwaDF2Ny41SDE2eiIvPjwvZz48L3N2Zz4=) center no-repeat"
        }
    },
    formItemArray_actionMenuItem__remove: {
        "&::before": {
            /* tslint:disable-next-line */
            background: "url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHRpdGxlPm1pbnVzVXBkYXRlZDwvdGl0bGU+PGc+PHBhdGggZD0iTTE2LDguNUgwdi0xaDE2VjguNXoiLz48L2c+PC9zdmc+) center no-repeat"
        }
    },
    formItemArray_linkMenu: {
        ...applyCleanListStyle(),
        ...applyListItemStyle()
    }
};

export default styles;
