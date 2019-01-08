import { ellipsis, focusVisible, toPx } from "@microsoft/fast-jss-utilities";
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
        display: "grid",
        marginBottom: "12px",
    },
    formItemArray_control: {
        width: "100%",
        position: "relative",
        verticalAlign: "middle",
    },
    formItemArray_controlAddButton: {
        position: "absolute",
        right: "5px",
        top: "5px",
        appearance: "none",
        background: "none",
        border: "none",
        width: "20px",
        height: "20px",
        zIndex: "1",
        borderRadius: "2px",
        [`&${focusVisible()}`]: {
            ...insetStrongBoxShadow(colors.pink),
            outline: "none",
        },
        "&::before": {
            position: "absolute",
            content: "''",
            pointerEvents: "none",
            width: "9px",
            height: "1px",
            left: "5.5px",
            top: "9.5px",
            background: "#F2F2F2",
        },
        "&::after": {
            position: "absolute",
            content: "''",
            pointerEvents: "none",
            width: "1px",
            height: "9px",
            left: "9.5px",
            top: "5.5px",
            background: "#F2F2F2",
        },
    },
    formItemArray_controlLabel: {
        ...applyLabelStyle(),
        ...applyControl(),
        verticalAlign: "middle",
        lineHeight: "30px",
    },
    formItemArray_existingItemList: {
        ...applyCleanListStyle(),
        fontSize: "11px",
    },
    formItemArray_existingItemListItem: {
        position: "relative",
        height: "30px",
        lineHeight: "30px",
    },
    formItemArray_existingItemListItemLink: {
        ...ellipsis(),
        cursor: "pointer",
        display: "block",
        height: "30px",
        lineHeight: "30px",
        width: "calc(100% - 30px)",
    },
    formItemArray_existingItemRemoveButton: {
        ...applyRemoveItemStyle(),
        cursor: "pointer",
    },
};

export default styles;
