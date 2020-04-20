import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { applyFocusVisible } from "@microsoft/fast-jss-utilities";
import { insetStrongBoxShadow } from "../style";
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
        "font-size": "12px",
        "text-indent": "1em",
        background: neutralLayerL4,
        color: foreground300,
        height: "100%",
        "& $navigation_item::before": {
            content: "''",
            height: "100%",
            position: "absolute",
            left: "calc(1em - 16px)",
            "border-right": `1px solid ${neutralOutlineActive}`,
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
        "font-size": "12px",
        display: "block",
        cursor: "pointer",
        border: "1px solid transparent",
        ...applyFocusVisible({
            ...insetStrongBoxShadow(accent),
        }),
        "&::before": {
            content: "''",
            display: "inline-block",
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
        "border-color": neutralOutlineActive,
    },
    navigation_itemTrigger__hoverAfter: {
        "border-bottom-color": neutralOutlineActive,
    },
    navigation_itemTrigger__hoverBefore: {
        "border-top-color": neutralOutlineActive,
    },
    navigation_itemTrigger__expandable: {
        "&::before": {
            "border-left": `4px solid ${foreground300}`,
        },
    },
    navigation_itemTrigger__active: {
        background: neutralFillStealthSelected,
    },
    navigation_itemList: {
        display: "none",
        "font-size": "calc(100% + 20px)",
    },
};

export default styles;
