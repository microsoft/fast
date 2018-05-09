import { ellipsis, toPx } from "@microsoft/fast-jss-utilities";
import {
    applyAriaHiddenStyles,
    applyCleanListStyle,
    applyInputStyle,
    applyListItemStyle,
    applyPopupMenuButtonStyles,
    applyPopupMenuStyles
} from "../utilities/form-input.shared-style.style";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IFormItemChildrenClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<IFormItemChildrenClassNameContract, {}> = {
    formItemChildren: {
        display: "flex",
        flexDirection: "column"
    },
    formItemChildren_inputWrapper: {
        display: "flex",
        paddingBottom: toPx(12),
        "& input": {
            ...applyInputStyle(),
            flex: "2",
            marginRight: toPx(8)
        },
        "& button": {
            fontSize: toPx(15),
            maxWidth: toPx(374),
            minWidth: toPx(120),
            flex: "1",
            display: "inline-block",
            padding: `${toPx(13)} ${toPx(12)} ${toPx(12)}`,
            border: `${toPx(2)} solid transparent`,
            borderRadius: toPx(2),
            cursor: "pointer",
            overflow: "hidden",
            lineHeight: "1",
            textAlign: "center",
            whiteSpace: "nowrap",
            verticalAlign: "bottom",
            transition: "all 0.2s ease-in-out",
            color: "white",
            background: "#0078D4",
            "&:hover": {
                background: "#0075CF"
            },
            "&:focus": {
                outline: "none",
                background: "#005EA6"
            },
            "&:disabled, &[aria-disabled]": {
                opacity: ".4",
                cursor: "not-allowed",
                "&:hover": {
                    background: "#D3E6F5"
                }
            }
        }
    },
    formItemChildren_childOptionsMenu: {
        ...applyCleanListStyle(),
        "& li": {
            padding: `${toPx(4)} 0`,
            "& a": {
                color: "#0078D7",
                textDecoration: "underline"
            }
        }
    },
    formItemChildren_existingChildren: {
        position: "relative",
        "& > div": {
            display: "flex",
            borderBottom: `${toPx(1)} solid rgba(0,0,0,.2)`,
            "& h3": {
                flexGrow: "1",
                "& + button": {
                    ...applyPopupMenuButtonStyles()
                }
            }
        },
        "& ul": {
            ...applyAriaHiddenStyles()
        }
    },
    formItemChildren_addedChildren: {
        ...applyCleanListStyle(),
        ...applyListItemStyle(),
        "& li a > span": {
            display: "block",
            fontStyle: "italic",
            fontSize: toPx(13),
            paddingTop: toPx(4)
        }
    },
    formItemChildren_optionMenu: {
        ...applyCleanListStyle(),
        ...applyPopupMenuStyles()
    }
};

export default styles;
