import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { applyFocusVisible } from "@microsoft/fast-jss-utilities";
import {
    accentColorCSSProperty,
    applyTriggerStyle,
    borderRadiusCSSProperty,
    defaultTextSizeCSSProperty,
    inactiveTextColorCSSProperty,
    insetStrongBoxShadow,
    L4CSSProperty,
    textColorCSSProperty,
} from "../style";
import { NavigationMenuItemClassNameContract } from "./navigation-menu-item.props";

export interface NavigationMenuClassNameContract
    extends NavigationMenuItemClassNameContract {
    navigationMenu?: string;
}

const styles: ComponentStyles<NavigationMenuClassNameContract, {}> = {
    navigationMenu: {
        "font-size": defaultTextSizeCSSProperty,
        background: L4CSSProperty,
        color: inactiveTextColorCSSProperty,
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
        ...applyTriggerStyle(inactiveTextColorCSSProperty),
        display: "block",
        width: "100%",
        textAlign: "start",
        textDecoration: "none",
        background: "transparent",
        fontFamily: "inherit",
        textIndent: "inherit",
        cursor: "pointer",
        position: "relative",
        '&[aria-expanded="false"]::before, &[aria-expanded="true"]::before': {
            content: "''",
            display: "inline-block",
            marginLeft: "-13px",
            marginRight: "5px",
        },
        "&::before": {
            borderTop: "4px solid transparent",
            borderLeft: `4px solid ${textColorCSSProperty}`,
            borderRight: "4px solid transparent",
            borderBottom: "4px solid transparent",
        },
        '&[aria-expanded="true"]::before': {
            transform: "rotate(45deg)",
        },
        ...applyFocusVisible({
            ...insetStrongBoxShadow(accentColorCSSProperty),
        }),
    },
    navigationMenuItem_listItem__active: {
        "font-weight": "bold",
        color: textColorCSSProperty,
        "&::after": {
            content: "''",
            position: "absolute",
            background: accentColorCSSProperty,
            borderRadius: borderRadiusCSSProperty,
            width: "2px",
            height: "calc(100% - 4px)",
            top: "2px",
            left: "2px",
        },
    },
};

export default styles;
