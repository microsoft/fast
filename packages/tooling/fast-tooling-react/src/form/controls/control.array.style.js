import { ellipsis } from "@microsoft/fast-jss-utilities";
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
const styles = {
    arrayControl: {},
    arrayControl__disabled: {},
    arrayControl__invalid: {
        "& $arrayControl_existingItemList": {
            "&::before": {
                "border-color": errorColorCSSProperty,
            },
        },
    },
    arrayControl_invalidMessage: Object.assign(Object.assign({}, invalidMessageStyle), {
        "padding-bottom": "5px",
        "margin-top": "-5px",
    }),
    arrayControl_addItem: Object.assign(Object.assign({}, labelRegionStyle), {
        position: "relative",
    }),
    arrayControl_addItemLabel: Object.assign(Object.assign({}, labelStyle), {
        "max-width": "calc(100% - 30px)",
    }),
    arrayControl_addItemButton: Object.assign({}, addItemStyle),
    arrayControl_existingItemList: Object.assign(Object.assign({}, cleanListStyle), {
        position: "relative",
        "&::before": {
            content: "''",
            display: "block",
            width: "100%",
            "border-bottom": "1px solid transparent",
            position: "absolute",
            top: "0",
            bottom: "0",
        },
    }),
    arrayControl_existingItemListItem: {
        position: "relative",
        cursor: "pointer",
        height: "30px",
        "line-height": "30px",
        paddingBottom: "5px",
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
    arrayControl_existingItemListItemLink: Object.assign(Object.assign({}, ellipsis()), {
        cursor: "pointer",
        display: "block",
        height: "30px",
        "line-height": "30px",
        width: "calc(100% - 40px)",
        padding: "0 5px",
        "background-color": L1CSSProperty,
        "&$arrayControl_existingItemListItemLink__default": Object.assign(
            Object.assign({}, defaultFontStyle),
            { cursor: "auto" }
        ),
    }),
    arrayControl_existingItemListItemLink__default: {},
    arrayControl_existingItemRemoveButton: Object.assign(
        Object.assign({}, removeItemStyle),
        { cursor: "pointer" }
    ),
};
export default styles;
