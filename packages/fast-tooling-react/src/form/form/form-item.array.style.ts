import { ellipsis, focusVisible } from "@microsoft/fast-jss-utilities";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import {
    accent,
    applyCleanListStyle,
    applyControlRegion,
    applyControlWrapper,
    applyFormItemIndicator,
    applyGlobalStyle,
    applyInteractiveFormItemIndicator,
    applyInvalidMessage,
    applyLabelRegionStyle,
    applyLabelStyle,
    applyRemoveItemStyle,
    applySoftRemove,
    applySoftRemoveInput,
    background100,
    foreground300,
    insetStrongBoxShadow,
} from "../../style";
import { FormItemArrayClassNameContract } from "./form-item.array.props";

const styles: ComponentStyles<FormItemArrayClassNameContract, {}> = {
    "@global": {
        ...applyGlobalStyle(),
    },
    formItemArray: {
        ...applyControlWrapper(),
    },
    formItemArray_addItem: {
        ...applyLabelRegionStyle(),
        position: "relative",
    },
    formItemArray_addItemLabel: {
        ...applyLabelStyle(),
        maxWidth: "calc(100% - 30px)",
    },
    formItemArray_badge: {
        ...applyFormItemIndicator(),
    },
    formItemArray_control: {
        width: "100%",
        position: "relative",
        verticalAlign: "middle",
    },
    formItemArray_addItemButton: {
        position: "absolute",
        right: "5px",
        top: "1px",
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
        borderBottom: "1px solid transparent",
    },
    formItemArray_controlLabel__invalid: {
        borderColor: "red",
    },
    formItemArray_controlLabelRegion: {
        ...applyLabelRegionStyle(),
        width: "calc(100% - 30px)",
    },
    formItemArray_controlRegion: {
        ...applyControlRegion(),
    },
    formItemArray_defaultValueIndicator: {
        ...applyInteractiveFormItemIndicator(),
    },
    formItemArray_existingItemList: {
        ...applyCleanListStyle(),
        fontSize: "12px",
    },
    formItemArray_existingItemListItem__sorting: {
        fontSize: "12px",
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
    formItemArray_existingItemListItemLink__default: {
        cursor: "auto",
    },
    formItemArray_existingItemRemoveButton: {
        ...applyRemoveItemStyle(),
        cursor: "pointer",
    },
    formItemArray_invalidMessage: {
        ...applyInvalidMessage(),
    },
    formItemArray_softRemove: {
        ...applySoftRemove(),
    },
    formItemArray_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
