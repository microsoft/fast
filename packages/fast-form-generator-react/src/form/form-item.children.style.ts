import { ellipsis, toPx } from "@microsoft/fast-jss-utilities";
import {
    applyAddItemStyle,
    applyAriaHiddenStyles,
    applyCleanListStyle,
    applyGlobalStyle,
    applyInputStyle,
    applyListItemStyle,
    applyPopupHeadingStyles,
    applyPopupMenuStyles,
    colors,
    localizePadding,
    pinkPlus,
    thickLine,
    trashcan
} from "../utilities/form-input.style";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IFormItemChildrenClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<IFormItemChildrenClassNameContract, {}> = {
    "@global": {
        ...applyGlobalStyle()
    },
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
            color: colors.white,
            background: colors.pink,
            "&:hover": {
                background: colors.lightPink
            },
            "&:focus": {
                outline: "none",
                background: colors.darkPink
            }
        }
    },
    formItemChildren_childOptionsMenu: {
        ...applyCleanListStyle(),
        "& li": {
            padding: `${toPx(8)} 0`,
            "& button": {
                ...applyAddItemStyle(),
                ...localizePadding(0, 0, 0, 24),
                ...thickLine
            }
        }
    },
    formItemChildren_childOptionsTextButton: {
        ...applyAddItemStyle(),
        ...localizePadding(12, 8, 8, 24),
        ...thickLine,
        display: "flex",
        width: "fit-content"
    },
    formItemChildren_existingChildren: {
        ...applyPopupHeadingStyles(),
        "& ul": {
            ...applyAriaHiddenStyles()
        }
    },
    formItemChildren_addedChildren: {
        ...applyCleanListStyle(),
        ...applyListItemStyle(),
    },
    formItemChildren_optionMenu: {
        ...applyCleanListStyle(),
        ...applyPopupMenuStyles()
    },
    formItemChildren_optionMenu__listItem: {
        "& button": {
            "&::before": {
                position: "absolute",
                content: "''",
                opacity: ".6",
                pointerEvents: "none",
                top: toPx(12),
                width: toPx(16),
                height: toPx(16),
                left: toPx(12),
                /* tslint:disable-next-line */
                background: trashcan
            }
        }
    }
};

export default styles;
