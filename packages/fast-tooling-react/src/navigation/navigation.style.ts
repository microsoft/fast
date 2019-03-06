import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { applyTriggerStyle, insetStrongBoxShadow } from "./navigation.utilities.style";
import { accent, background300, background800, foreground300 } from "../style/constants";

export interface NavigationClassNameContract {
    navigation?: string;
    navigation_item?: string;
    navigation_itemLink?: string;
    navigation_itemLink__active?: string;
    navigation_itemExpandListTrigger?: string;
    navigation_itemExpandListTrigger__active?: string;
    navigation_itemList?: string;
}

const styles: ComponentStyles<NavigationClassNameContract, {}> = {
    navigation: {
        fontSize: "12px",
        background: background300,
        color: foreground300,
        height: "100%",
    },
    navigation_item: {
        display: "flex",
        flexFlow: "column",
        textIndent: "1em",
        '&[aria-expanded="true"] > $navigation_itemList': {
            display: "block",
        },
        '&[aria-expanded="false"] > $navigation_itemExpandListTrigger::before, &[aria-expanded="true"] > $navigation_itemExpandListTrigger::before': {
            content: "''",
            display: "inline-block",
            marginLeft: "-11px",
            marginRight: "5px",
        },
        '&[aria-expanded="false"] > $navigation_itemExpandListTrigger::before': {
            borderTop: "3px solid transparent",
            borderLeft: `3px solid ${foreground300}`,
            borderRight: "3px solid transparent",
            borderBottom: "3px solid transparent",
        },
        '&[aria-expanded="true"] > $navigation_itemExpandListTrigger::before': {
            borderTop: `3px solid ${foreground300}`,
            borderLeft: "3px solid transparent",
            borderRight: "3px solid transparent",
            borderBottom: "3px solid transparent",
        },
    },
    navigation_itemLink: {
        ...applyTriggerStyle(foreground300),
        textDecoration: "none",
        "&:focus": {
            ...insetStrongBoxShadow(accent),
        },
    },
    navigation_itemLink__active: {
        background: background800,
    },
    navigation_itemExpandListTrigger: {
        ...applyTriggerStyle(foreground300),
        position: "relative",
        cursor: "pointer",
        "&:focus": {
            ...insetStrongBoxShadow(accent),
        },
    },
    navigation_itemExpandListTrigger__active: {
        background: background800,
    },
    navigation_itemList: {
        display: "none",
        fontSize: "calc(100% + 20px)",
    },
};

export default styles;
