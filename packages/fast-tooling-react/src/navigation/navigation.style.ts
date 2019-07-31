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
    /**
     * @deprecated
     */
    navigation_item__childItem?: string;
    navigation_item__primitiveChild?: string;
    navigation_item__component?: string;
    navigation_item__draggable?: string;
    navigation_item__dragging?: string;
    navigation_itemContent?: string;
    navigation_itemContent__active?: string;
    navigation_itemContent__dragHover?: string;
    navigation_itemContent__dragHoverBefore?: string;
    navigation_itemContent__dragHoverAfter?: string;
    navigation_itemList?: string;
}

const styles: ComponentStyles<NavigationClassNameContract, {}> = {
    navigation: {
        fontSize: "12px",
        background: neutralLayerL4,
        color: foreground300,
        height: "100%",
    },
    navigation_item: {
        display: "flex",
        flexFlow: "column",
        textIndent: "1em",
        position: "relative",
        cursor: "pointer",
        "& $navigation_item::after": {
            content: "''",
            height: "100%",
            position: "absolute",
            left: "calc(1em - 13px)",
            borderRight: `1px solid ${neutralOutlineActive}`,
        },
        '&[aria-expanded="true"] > $navigation_itemList': {
            display: "block",
        },
        '&[aria-expanded="false"] > $navigation_itemContent > $navigation_itemExpandTrigger::before, &[aria-expanded="true"] > $navigation_itemContent > $navigation_itemExpandTrigger::before': {
            content: "''",
            display: "inline-block",
            marginLeft: "6px",
        },
        '&[aria-expanded="false"] > $navigation_itemContent > $navigation_itemExpandTrigger::before': {
            borderTop: "4px solid transparent",
            borderLeft: `4px solid ${foreground300}`,
            borderRight: "4px solid transparent",
            borderBottom: "4px solid transparent",
        },
        '&[aria-expanded="true"] > $navigation_itemContent > $navigation_itemExpandTrigger::before': {
            borderTop: "4px solid transparent",
            borderLeft: `4px solid ${foreground300}`,
            borderRight: "4px solid transparent",
            borderBottom: "4px solid transparent",
            transform: "rotate(45deg)",
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
        verticalAlign: "middle",
        marginLeft: "-17px",
        marginRight: "5px",
        "&:focus": {
            outline: "none",
        },
        "&::before": {
            alignItems: "center",
        },
    },
    navigation_item__childItem: {
        "& > $navigation_itemContent": {
            fontStyle: "normal",
        },
    },
    navigation_item__primitiveChild: {
        "& > $navigation_itemContent": {
            fontStyle: "normal",
        },
        "& > $navigation_itemContent$navigation_itemContent__dragHover": {
            background: "none",
        },
    },
    navigation_item__component: {
        "& > $navigation_itemContent": {
            fontStyle: "normal",
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
    navigation_itemContent: {
        ...applyTriggerStyle(foreground300),
        cursor: "inherit",
        textDecoration: "none",
        fontStyle: "italic",
        ...applyFocusVisible({
            ...insetStrongBoxShadow(accent),
        }),
    },
    navigation_itemContent__active: {
        background: neutralFillStealthSelected,
        position: "relative",
        borderRadius: "2px",
        "&::before": {
            content: "''",
            position: "absolute",
            background: accent,
            borderRadius: "2px",
            width: "2px",
            height: "calc(100% - 4px)",
            top: "2px",
            left: "2px",
        },
    },
    navigation_itemContent__dragHover: {
        background: accent,
    },
    navigation_itemContent__dragHoverBefore: {
        boxShadow: `inset 0 1px ${accent}`,
    },
    navigation_itemContent__dragHoverAfter: {
        boxShadow: `inset 0 -1px ${accent}`,
    },
    navigation_itemList: {
        display: "none",
        fontSize: "calc(100% + 20px)",
    },
};

export default styles;
