import { ellipsis, focusVisible } from "@microsoft/fast-jss-utilities";
import { accent, background100, foreground300 } from "./form.constants.style";
import {
    applyCleanListStyle,
    applyControl,
    applyControlWrapper,
    applyGlobalStyle,
    applyLabelStyle,
    applyRemoveItemStyle,
    insetStrongBoxShadow,
} from "./form.utilities.style";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { FormItemArrayClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<FormItemArrayClassNameContract, {}> = {
    "@global": {
        ...applyGlobalStyle(),
    },
    formItemArray: {
        display: "grid",
        ...applyControlWrapper(),
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
            ...insetStrongBoxShadow(accent),
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
            background: foreground300,
        },
        "&::after": {
            position: "absolute",
            content: "''",
            pointerEvents: "none",
            width: "1px",
            height: "9px",
            left: "9.5px",
            top: "5.5px",
            background: foreground300,
        },
    },
    formItemArray_controlLabel: {
        ...applyLabelStyle(),
        ...applyControl(),
    },
    formItemArray_existingItemList: {
        ...applyCleanListStyle(),
        fontSize: "11px",
    },
    formItemArray_existingItemListItem__sorting: {
        fontSize: "11px",
        color: foreground300,
        cursor: "pointer",
    },
    formItemArray_existingItemListItem: {
        position: "relative",
        paddingLeft: "10px",
        marginLeft: "-10px",
        cursor: "pointer",
        height: "30px",
        lineHeight: "30px",
        "&$formItemArray_existingItemListItem__sorting": {
            backgroundColor: background100,
        },
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.04)",
        },
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
