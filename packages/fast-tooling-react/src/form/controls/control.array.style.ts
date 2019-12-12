import { ellipsis } from "@microsoft/fast-jss-utilities";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import {
    applyAddItemStyle,
    applyCleanListStyle,
    applyInvalidMessage,
    applyLabelRegionStyle,
    applyLabelStyle,
    applyRemoveItemStyle,
} from "../../style";

/**
 * Array class name contract
 */
export interface ArrayControlClassNameContract {
    arrayControl?: string;
    arrayControl__disabled?: string;
    arrayControl__invalid?: string;
    arrayControl_invalidMessage?: string;
    arrayControl_addItem?: string;
    arrayControl_addItemButton?: string;
    arrayControl_addItemLabel?: string;
    arrayControl_existingItemList?: string;
    arrayControl_existingItemListItem?: string;
    arrayControl_existingItemListItem__invalid?: string;
    arrayControl_existingItemListItemLink?: string;
    arrayControl_existingItemListItemLink__default?: string;
    arrayControl_existingItemRemoveButton?: string;
}

const styles: ComponentStyles<ArrayControlClassNameContract, {}> = {
    arrayControl: {},
    arrayControl__disabled: {},
    arrayControl__invalid: {
        "& $arrayControl_existingItemList": {
            "&::before": {
                "border-color": "red",
            },
        },
    },
    arrayControl_invalidMessage: {
        ...applyInvalidMessage(),
        "padding-bottom": "5px",
        "margin-top": "-5px",
    },
    arrayControl_addItem: {
        ...applyLabelRegionStyle(),
        position: "relative",
    },
    arrayControl_addItemLabel: {
        ...applyLabelStyle(),
        "max-width": "calc(100% - 30px)",
    },
    arrayControl_addItemButton: {
        ...applyAddItemStyle(),
    },
    arrayControl_existingItemList: {
        ...applyCleanListStyle(),
        "font-size": "12px",
        position: "relative",
        "&::before": {
            content: "''",
            display: "block",
            width: "calc(100% - 30px)",
            "border-bottom": "1px solid transparent",
            position: "absolute",
            top: "0",
            bottom: "0",
        },
    },
    arrayControl_existingItemListItem: {
        position: "relative",
        "padding-left": "10px",
        "margin-left": "-10px",
        cursor: "pointer",
        height: "30px",
        "line-height": "30px",
        "margin-bottom": "5px",
        "border-radius": "2px",
        "&::before": {
            content: "''",
            position: "absolute",
            "border-radius": "2px",
            "pointer-events": "none",
            height: "inherit",
            width: "calc(100% - 40px)",
            border: "1px solid transparent",
        },
    },
    arrayControl_existingItemListItem__invalid: {
        "&::before": {
            background: "rgba(255,0,0,0.1)",
            "border-color": "red",
            "box-sizing": "border-box",
        },
    },
    arrayControl_existingItemListItemLink: {
        ...ellipsis(),
        cursor: "pointer",
        display: "block",
        height: "30px",
        "line-height": "30px",
        width: "calc(100% - 40px)",
        padding: "0 5px",
        "background-color": "rgba(255, 255, 255, 0.04)",
    },
    arrayControl_existingItemListItemLink__default: {
        cursor: "auto",
    },
    arrayControl_existingItemRemoveButton: {
        ...applyRemoveItemStyle(),
        cursor: "pointer",
    },
};

export default styles;
