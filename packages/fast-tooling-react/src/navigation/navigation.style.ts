import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import { applyFocusVisible } from "@microsoft/fast-jss-utilities";
import { applyTriggerStyle, insetStrongBoxShadow } from "../style";
import {
    accent,
    foreground300,
    neutralFillStealthSelected,
    neutralLayerL4,
    neutralOutlineActive,
} from "../style/constants";

export interface NavigationClassNameContract {
    navigation?: string;
    navigation_item?: string;
    navigation_itemExpandTrigger?: string;
    navigation_item__draggable?: string;
    navigation_item__dragging?: string;
    navigation_itemText?: string;
    navigation_itemText__active?: string;
    navigation_itemList?: string;
}

const styles: ComponentStyles<NavigationClassNameContract, {}> = {
    navigation: {
        "font-size": "12px",
        background: neutralLayerL4,
        color: foreground300,
        height: "100%",
    },
    navigation_item: {
        display: "flex",
        "flex-flow": "column",
        "text-indent": "1em",
        position: "relative",
        cursor: "pointer",
        "& $navigation_item::after": {
            content: "''",
            height: "100%",
            position: "absolute",
            left: "calc(1em - 13px)",
            "border-right": `1px solid ${neutralOutlineActive}`,
        },
        '&[aria-expanded="true"] > $navigation_itemList': {
            display: "block",
        },
        '&[aria-expanded="false"] > $navigation_itemText > $navigation_itemExpandTrigger::before, &[aria-expanded="true"] > $navigation_itemText > $navigation_itemExpandTrigger::before': {
            content: "''",
            display: "inline-block",
            "margin-left": "6px",
        },
        '&[aria-expanded="false"] > $navigation_itemText > $navigation_itemExpandTrigger::before': {
            "border-top": "4px solid transparent",
            "border-left": `4px solid ${foreground300}`,
            "border-right": "4px solid transparent",
            "border-bottom": "4px solid transparent",
        },
        '&[aria-expanded="true"] > $navigation_itemText > $navigation_itemExpandTrigger::before': {
            "border-top": "4px solid transparent",
            "border-left": `4px solid ${foreground300}`,
            "border-right": "4px solid transparent",
            "border-bottom": "4px solid transparent",
            transform: "rotate(45deg)",
        },
        "& > span": {
            ...applyTriggerStyle(foreground300),
            cursor: "inherit",
            "text-decoration": "none",
            ...applyFocusVisible({
                ...insetStrongBoxShadow(accent),
            }),
        },
    },
    navigation_itemExpandTrigger: {
        display: "inline-flex",
        cursor: "pointer",
        background: "transparent",
        width: "12px",
        height: "12px",
        border: "none",
        padding: "0",
        "vertical-align": "middle",
        "margin-left": "-17px",
        "margin-right": "5px",
        "&:focus": {
            outline: "none",
        },
        "&::before": {
            "align-items": "center",
        },
    },
    navigation_item__draggable: {
        cursor: "grab",
    },
    navigation_item__dragging: {
        "&$navigation_item__draggable": {
            cursor: "grabbing",
        },
    },
    navigation_itemText: {
        ...applyTriggerStyle(foreground300),
        cursor: "inherit",
        "text-decoration": "none",
        "font-style": "italic",
        ...applyFocusVisible({
            ...insetStrongBoxShadow(accent),
        }),
    },
    navigation_itemText__active: {
        background: neutralFillStealthSelected,
        position: "relative",
        "border-radius": "2px",
        "&::before": {
            content: "''",
            position: "absolute",
            background: accent,
            "border-radius": "2px",
            width: "2px",
            height: "calc(100% - 4px)",
            top: "2px",
            left: "2px",
        },
    },
    navigation_itemList: {
        display: "none",
        "font-size": "calc(100% + 20px)",
    },
};

export default styles;
