import { ellipsis } from "@microsoft/fast-jss-utilities";
import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    addItemStyle,
    borderRadiusCSSProperty,
    cleanListStyle,
    defaultFontStyle,
    errorColorCSSProperty,
    gutterCSSProperty,
    invalidMessageStyle,
    L1CSSProperty,
    labelRegionStyle,
    labelStyle,
    removeItemStyle,
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
                "border-color": errorColorCSSProperty,
            },
        },
    },
    arrayControl_invalidMessage: {
        ...invalidMessageStyle,
        "padding-bottom": "5px",
        "margin-top": "-5px",
    },
    arrayControl_addItem: {
        ...labelRegionStyle,
        position: "relative",
    },
    arrayControl_addItemLabel: {
        ...labelStyle,
        "max-width": "calc(100% - 30px)",
    },
    arrayControl_addItemButton: {
        ...addItemStyle,
    },
    arrayControl_existingItemList: {
        ...cleanListStyle,
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
        cursor: "pointer",
        height: "30px",
        "line-height": "30px",
        "margin-bottom": "5px",
        "border-radius": borderRadiusCSSProperty,
        "&::before": {
            content: "''",
            position: "absolute",
            "border-radius": borderRadiusCSSProperty,
            "pointer-events": "none",
            height: "inherit",
            width: `calc(100% - calc(${gutterCSSProperty} + 6px))`,
            border: "1px solid transparent",
        },
    },
    arrayControl_existingItemListItem__invalid: {
        "&::before": {
            "border-color": errorColorCSSProperty,
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
        "background-color": L1CSSProperty,
        "&$arrayControl_existingItemListItemLink__default": {
            ...defaultFontStyle,
            cursor: "auto",
        },
    },
    arrayControl_existingItemListItemLink__default: {},
    arrayControl_existingItemRemoveButton: {
        ...removeItemStyle,
        cursor: "pointer",
    },
};

export default styles;
