import { ellipsis, toPx } from "@microsoft/fast-jss-utilities";
import {
    applyAriaHiddenStyles,
    applyCleanListStyle,
    applyControl,
    applyGlobalStyle,
    applyInputStyle,
    applyLabelStyle,
    applyRemoveItemStyle,
    applySoftRemove,
    colors,
    insetStrongBoxShadow,
    rightArrow,
} from "../utilities/form-input.style";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { FormItemChildrenClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<FormItemChildrenClassNameContract, {}> = {
    "@global": {
        ...applyGlobalStyle(),
        'body > div > li[draggable="true"] button': {
            display: "none",
        },
    },
    formItemChildren: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
    },
    formItemChildren_control: {
        ...applyControl(),
        verticalAlign: "middle",
        "& a": {
            cursor: "pointer",
            width: "100%",
            display: "inline-block",
            "& span, i": {
                ...ellipsis(),
                width: "100%",
                display: "inline-block",
            },
        },
    },
    formItemChildren_controlLabel: {
        ...applyLabelStyle(),
        display: "block",
        marginTop: toPx(12),
    },
    formItemChildren_addedChildren: {
        ...applyCleanListStyle(),
    },
    formItemChildren_childrenList: {
        ...applyCleanListStyle(),
        ...applyAriaHiddenStyles(),
        background: colors.white,
        maxHeight: "200px",
        overflow: "auto",
        position: "absolute",
        right: "0",
        left: "0",
        zIndex: "1",
        "& li": {
            padding: "10px 8px 10px",
            fontSize: "14px",
            textAlign: "left",
            '&[aria-selected="true"]': {
                background: colors.pink,
            },
        },
    },
    formItemChildren_childrenListControl: {
        position: "relative",
    },
    formItemChildren_childrenListInput: {
        ...applyInputStyle(),
        marginTop: "8px",
        paddingRight: "36px",
        width: "100%",
    },
    formItemChildren_childrenListTrigger: {
        position: "absolute",
        right: "0",
        bottom: "0",
        height: "36px",
        width: "36px",
        background: rightArrow,
        transform: "rotate(90deg)",
        border: "0",
        "&:focus": {
            ...insetStrongBoxShadow(colors.pink),
            outline: "none",
        },
    },
    formItemChildren_delete: {
        ...applySoftRemove(),
        cursor: "pointer",
        position: "relative",
        verticalAlign: "middle",
    },
    formItemChildren_deleteButton: {
        ...applyRemoveItemStyle(),
        cursor: "pointer",
    },
};

export default styles;
