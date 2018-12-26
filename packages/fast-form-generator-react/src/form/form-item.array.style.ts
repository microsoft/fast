import { ellipsis, toPx } from "@microsoft/fast-jss-utilities";
import {
    applyCleanListStyle,
    applyControl,
    applyGlobalStyle,
    applyLabelStyle,
    applyRemoveItemStyle,
    colors,
    insetStrongBoxShadow,
    lines,
    plus,
} from "../utilities/form-input.style";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { FormItemArrayClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<FormItemArrayClassNameContract, {}> = {
    "@global": {
        ...applyGlobalStyle(),
    },
    formItemArray: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
    },
    formItemArray_control: {
        width: "100%",
        verticalAlign: "middle",
        marginTop: toPx(12),
    },
    formItemArray_controlAddButton: {
        position: "absolute",
        right: "0",
        top: "12px",
        appearance: "none",
        background: "none",
        border: "none",
        margin: "8px",
        width: "20px",
        height: "16px",
        zIndex: "1",
        borderRadius: "2px",
        "&:focus": {
            ...insetStrongBoxShadow(colors.pink),
            outline: "none",
        },
        "&::before": {
            position: "absolute",
            content: "''",
            opacity: ".6",
            pointerEvents: "none",
            width: toPx(16),
            height: toPx(16),
            left: toPx(2),
            top: "0",
            background: plus,
        },
    },
    formItemArray_controlLabel: {
        ...applyLabelStyle(),
        ...applyControl(),
        verticalAlign: "middle",
        lineHeight: "32px",
    },
    formItemArray_existingItemList: {
        ...applyCleanListStyle(),
        "& li": {},
    },
    formItemArray_existingItemListItem: {
        position: "relative",
        height: "36px",
        lineHeight: "36px",
        paddingLeft: "26px",
        "&::before": {
            position: "absolute",
            content: "''",
            opacity: ".6",
            pointerEvents: "none",
            top: toPx(11),
            width: toPx(16),
            height: toPx(16),
            background: lines,
            left: "0",
        },
        "& a": {
            ...ellipsis(),
            cursor: "pointer",
            display: "block",
            height: "36px",
            lineHeight: "36px",
            width: "calc(100% - 36px)",
        },
    },
    formItemArray_existingItemRemoveButton: {
        ...applyRemoveItemStyle(),
        cursor: "pointer",
    },
};

export default styles;
