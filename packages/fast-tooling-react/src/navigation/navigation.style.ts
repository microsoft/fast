import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import { applyTriggerStyle, insetStrongBoxShadow } from "../style";
import {
    accent,
    foreground300,
    neutralLayerL3,
    neutralLayerL4,
    neutralOutlineActive,
} from "../style/constants";

export interface NavigationClassNameContract {
    navigation?: string;
    navigation_item?: string;
    navigation_item__childItem?: string;
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
        '&[aria-expanded="false"] > $navigation_itemContent::before, &[aria-expanded="true"] > $navigation_itemContent::before': {
            content: "''",
            display: "inline-block",
            marginLeft: "-11px",
            marginRight: "5px",
        },
        '&[aria-expanded="false"] > $navigation_itemContent::before': {
            borderTop: "3px solid transparent",
            borderLeft: `3px solid ${foreground300}`,
            borderRight: "3px solid transparent",
            borderBottom: "3px solid transparent",
        },
        '&[aria-expanded="true"] > $navigation_itemContent::before': {
            borderTop: "3px solid transparent",
            borderLeft: `3px solid ${foreground300}`,
            borderRight: "3px solid transparent",
            borderBottom: "3px solid transparent",
            transform: "rotate(45deg)",
        },
    },
    navigation_item__childItem: {
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
        "&:focus": {
            ...insetStrongBoxShadow(accent),
        },
    },
    navigation_itemContent__active: {
        background: neutralLayerL3,
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
