import { ellipsis, toPx } from "@microsoft/fast-jss-utilities";
import {
    applyAriaHiddenStyles,
    applyCleanListStyle,
    applyListItemStyle,
    applyPopupHeadingStyles,
    applyPopupMenuButtonStyles,
    applyPopupMenuStyles
} from "../utilities/form-input.style";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IFormItemArrayClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<IFormItemArrayClassNameContract, {}> = {
    formItemArray: {
        position: "relative",
        ...applyPopupHeadingStyles(),
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
        ...applyListItemStyle(),
        "& li button": {
            color: "black"
        }
    }
};

export default styles;
