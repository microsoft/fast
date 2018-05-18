import { ellipsis, toPx } from "@microsoft/fast-jss-utilities";
import {
    applyAriaHiddenStyles,
    applyCleanListStyle,
    applyGlobalStyle,
    applyListItemStyle,
    applyPopupHeadingStyles,
    applyPopupMenuStyles,
    colors,
    localizePadding,
    minus,
    plus
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
            background: plus
        }
    },
    formItemArray_actionMenuItem__remove: {
        "&::before": {
            background: minus
        }
    },
    formItemArray_linkMenu: {
        ...applyCleanListStyle(),
        ...applyListItemStyle()
    }
};

export default styles;
