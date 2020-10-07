import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { applyFocusVisible, ellipsis } from "@microsoft/fast-jss-utilities";
import {
    accentColorCSSProperty,
    defaultTextSizeCSSProperty,
    gutterCSSProperty,
    inactiveTextColorCSSProperty,
    insetStrongBoxShadow,
    L3OutlineColorProperty,
    L4CSSProperty,
    textColorCSSProperty,
} from "../style";

export interface NavigationClassNameContract {
    navigation?: string;
    navigation_item?: string;
    navigation_itemTrigger?: string;
    navigation_itemTrigger__active?: string;
    navigation_itemTrigger__draggable?: string;
    navigation_itemTrigger__droppable?: string;
    navigation_itemTrigger__expandable?: string;
    navigation_itemTrigger__hover?: string;
    navigation_itemTrigger__hoverBefore?: string;
    navigation_itemTrigger__hoverAfter?: string;
    navigation_itemList?: string;
}

const styles: ComponentStyles<NavigationClassNameContract, {}> = {
    navigation: {
        background: L4CSSProperty,
        color: textColorCSSProperty,
        height: "100%",
        padding: `0 calc(${gutterCSSProperty} / 2)`,
        overflow: "auto",
        "font-size": defaultTextSizeCSSProperty,
        "text-indent": "1em",
        "& $navigation_item::before": {
            content: "''",
            height: "100%",
            position: "absolute",
            left: "calc(1em - 12px)",
            "border-right": `1px solid ${L3OutlineColorProperty}`,
            "z-index": "1",
        },
    },
    navigation_item: {
        position: "relative",
        "text-indent": "1em",
        "line-height": "20px",
        "&[aria-expanded='true']": {
            "& > $navigation_itemTrigger__expandable::before": {
                transform: "rotate(45deg)",
            },
            "& > $navigation_itemList": {
                display: "block",
            },
        },
    },
    navigation_itemTrigger: {
        "font-size": defaultTextSizeCSSProperty,
        display: "block",
        cursor: "pointer",
        border: "1px solid transparent",
        color: inactiveTextColorCSSProperty,
        ...ellipsis(),
        ...applyFocusVisible({
            ...insetStrongBoxShadow(accentColorCSSProperty),
        }),
        "&::before": {
            content: "''",
            display: "inline-block",
            "margin-left": "-2px",
            "margin-right": "2px",
            "border-top": "4px solid transparent",
            "border-left": "4px solid transparent",
            "border-right": "4px solid transparent",
            "border-bottom": "4px solid transparent",
            "vertical-align": "middle",
        },
    },
    navigation_itemTrigger__draggable: {
        cursor: "grab",
    },
    navigation_itemTrigger__hover: {
        "border-color": L3OutlineColorProperty,
    },
    navigation_itemTrigger__hoverAfter: {
        "border-bottom-color": L3OutlineColorProperty,
    },
    navigation_itemTrigger__hoverBefore: {
        "border-top-color": L3OutlineColorProperty,
    },
    navigation_itemTrigger__expandable: {
        "&::before": {
            "border-left": `4px solid ${textColorCSSProperty}`,
        },
    },
    navigation_itemTrigger__active: {
        color: textColorCSSProperty,
        "font-weight": "600",
    },
    navigation_itemList: {
        display: "none",
        "font-size": "calc(100% + 20px)",
    },
};

export default styles;
