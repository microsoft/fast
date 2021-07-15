import { applyFocusVisible, ellipsis } from "@microsoft/fast-jss-utilities";
import {
    accentColorCSSProperty,
    defaultTextSizeCSSProperty,
    gutterCSSProperty,
    inactiveTextColorCSSProperty,
    inputStyle,
    insetStrongBoxShadow,
    L3OutlineColorProperty,
    L4CSSProperty,
    textColorCSSProperty,
} from "../style";
const styles = {
    navigation: {
        background: L4CSSProperty,
        color: textColorCSSProperty,
        height: "100%",
        padding: `0 calc(${gutterCSSProperty} / 2)`,
        overflow: "auto",
        "font-size": defaultTextSizeCSSProperty,
        "text-indent": "1em",
        "& $navigation_itemRegion::before": {
            content: "''",
            height: "100%",
            position: "absolute",
            left: "calc(1em - 12px)",
            "z-index": "1",
        },
    },
    navigation_itemRegion: {
        position: "relative",
        "text-indent": "1em",
        "line-height": "28px",
        "&[aria-expanded='true']": {
            "& > $navigation_item > $navigation_itemExpandTrigger": {
                transform: "rotate(45deg)",
            },
            "& > $navigation_itemList": {
                display: "block",
            },
        },
    },
    navigation_itemContent: {},
    navigation_itemDisplayTextInput: Object.assign(Object.assign({}, inputStyle), {
        width: "160px",
    }),
    navigation_itemExpandTrigger: {
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
    navigation_item: Object.assign(
        Object.assign(
            {
                "font-size": defaultTextSizeCSSProperty,
                display: "block",
                cursor: "pointer",
                border: "1px solid transparent",
                color: inactiveTextColorCSSProperty,
            },
            ellipsis()
        ),
        {
            "& > [data-dictionaryid]": Object.assign(
                {
                    padding: "6px 8px",
                    "border-radius": "var(--fast-tooling-border-radius, 3px)",
                },
                applyFocusVisible(
                    Object.assign({}, insetStrongBoxShadow(accentColorCSSProperty))
                )
            ),
        }
    ),
    navigation_item__draggable: {
        cursor: "grab",
    },
    navigation_item__hover: {
        "border-color": L3OutlineColorProperty,
    },
    navigation_item__hoverAfter: {
        "border-bottom-color": L3OutlineColorProperty,
    },
    navigation_item__hoverBefore: {
        "border-top-color": L3OutlineColorProperty,
    },
    navigation_item__expandable: {
        "& > $navigation_itemExpandTrigger": {
            "border-left": `4px solid ${textColorCSSProperty}`,
        },
    },
    navigation_item__active: {
        color: textColorCSSProperty,
        "font-weight": "600",
    },
    navigation_itemList: {
        display: "none",
        "font-size": "calc(100% + 20px)",
    },
};
export default styles;
