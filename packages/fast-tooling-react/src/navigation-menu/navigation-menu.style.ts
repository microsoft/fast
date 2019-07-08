import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import { applyTriggerStyle, insetStrongBoxShadow } from "../style";
import { accent, background800, foreground300, neutralLayerL4 } from "../style/constants";
import { NavigationMenuItemClassNameContract } from "./navigation-menu-item.props";

export interface NavigationMenuClassNameContract
    extends NavigationMenuItemClassNameContract {
    navigationMenu?: string;
}

const styles: ComponentStyles<NavigationMenuClassNameContract, {}> = {
    navigationMenu: {
        fontSize: "12px",
        background: neutralLayerL4,
        color: foreground300,
        height: "100%",
    },
    navigationMenuItem: {
        textIndent: "1em",
    },
    navigationMenuItem_list: {
        display: "none",
        fontSize: "calc(100% + 20px)",
    },
    navigationMenuItem_list__expanded: {
        "&$navigationMenuItem_list": {
            display: "block",
        },
    },
    navigationMenuItem_listItem: {
        ...applyTriggerStyle(foreground300),
        display: "block",
        width: "100%",
        textAlign: "start",
        textDecoration: "none",
        background: "transparent",
        fontFamily: "inherit",
        textIndent: "inherit",
        cursor: "pointer",
        '&[aria-expanded="false"]::before, &[aria-expanded="true"]::before': {
            content: "''",
            display: "inline-block",
            marginLeft: "-11px",
            marginRight: "5px",
        },
        '&[aria-expanded="false"]::before': {
            borderTop: "3px solid transparent",
            borderLeft: `3px solid ${foreground300}`,
            borderRight: "3px solid transparent",
            borderBottom: "3px solid transparent",
        },
        '&[aria-expanded="true"]::before': {
            borderTop: `3px solid ${foreground300}`,
            borderLeft: "3px solid transparent",
            borderRight: "3px solid transparent",
            borderBottom: "3px solid transparent",
        },
        "&:focus": {
            ...insetStrongBoxShadow(accent),
        },
    },
    navigationMenuItem_listItem__active: {
        background: background800,
    },
};

export default styles;
