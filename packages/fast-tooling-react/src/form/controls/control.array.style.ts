import { ellipsis } from "@microsoft/fast-jss-utilities";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import {
    applyAddItemStyle,
    applyCleanListStyle,
    applyControlRegion,
    applyControlWrapper,
    applyFormControlIndicator,
    applyGlobalStyle,
    applyInteractiveFormControlIndicator,
    applyInvalidMessage,
    applyLabelRegionStyle,
    applyLabelStyle,
    applyRemoveItemStyle,
    applySoftRemove,
    applySoftRemoveInput,
    background100,
    foreground300,
} from "../../style";
import { ArrayFormControlClassNameContract } from "./control.array.props";

const styles: ComponentStyles<ArrayFormControlClassNameContract, {}> = {
    "@global": {
        ...applyGlobalStyle(),
    },
    arrayFormControl: {
        ...applyControlWrapper(),
    },
    arrayFormControl_addItem: {
        ...applyLabelRegionStyle(),
        position: "relative",
    },
    arrayFormControl_addItemLabel: {
        ...applyLabelStyle(),
        maxWidth: "calc(100% - 30px)",
    },
    arrayFormControl_badge: {
        ...applyFormControlIndicator(),
    },
    arrayFormControl_control: {
        width: "100%",
        position: "relative",
        verticalAlign: "middle",
    },
    arrayFormControl_addItemButton: {
        ...applyAddItemStyle(),
    },
    arrayFormControl_controlLabel: {
        ...applyLabelStyle(),
        borderBottom: "1px solid transparent",
    },
    arrayFormControl_controlLabel__invalid: {
        borderColor: "red",
    },
    arrayFormControl_controlLabelRegion: {
        ...applyLabelRegionStyle(),
        width: "calc(100% - 30px)",
    },
    arrayFormControl_controlRegion: {
        ...applyControlRegion(),
    },
    arrayFormControl_defaultValueIndicator: {
        ...applyInteractiveFormControlIndicator(),
    },
    arrayFormControl_existingItemList: {
        ...applyCleanListStyle(),
        fontSize: "12px",
    },
    arrayFormControl_existingItemListItem__sorting: {
        fontSize: "12px",
        color: foreground300,
        cursor: "pointer",
    },
    arrayFormControl_existingItemListItem: {
        position: "relative",
        paddingLeft: "10px",
        marginLeft: "-10px",
        cursor: "pointer",
        height: "30px",
        lineHeight: "30px",
        "&$arrayFormControl_existingItemListItem__sorting": {
            backgroundColor: background100,
        },
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.04)",
        },
    },
    arrayFormControl_existingItemListItemLink: {
        ...ellipsis(),
        cursor: "pointer",
        display: "block",
        height: "30px",
        lineHeight: "30px",
        width: "calc(100% - 30px)",
    },
    arrayFormControl_existingItemListItemLink__default: {
        cursor: "auto",
    },
    arrayFormControl_existingItemRemoveButton: {
        ...applyRemoveItemStyle(),
        cursor: "pointer",
    },
    arrayFormControl_invalidMessage: {
        ...applyInvalidMessage(),
    },
    arrayFormControl_softRemove: {
        ...applySoftRemove(),
    },
    arrayFormControl_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
