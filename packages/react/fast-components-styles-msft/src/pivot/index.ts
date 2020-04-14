import { PivotClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    applyFocusVisible,
    directionSwitch,
    format,
    subtract,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";
import { height, heightNumber, horizontalSpacing } from "../utilities/density";
import {
    accentFillRest,
    neutralFocus,
    neutralForegroundActive,
    neutralForegroundHover,
    neutralForegroundRest,
} from "../utilities/color";
import { applyCornerRadius, applyFocusPlaceholderBorder } from "../utilities/border";
import { applyScaledTypeRamp } from "../utilities/typography";
import { focusOutlineWidth } from "../utilities/design-system";
import { applyCursorPointer } from "../utilities/cursor";
import {
    highContrastBorderColor,
    highContrastForeground,
    highContrastHighlightBackground,
    highContrastOptOutProperty,
    highContrastSelector,
} from "../utilities/high-contrast";

const activeIndicatorHeight: number = 3;
const styles: ComponentStyles<PivotClassNameContract, DesignSystem> = {
    pivot: {
        position: "relative",
        overflow: "hidden",
        color: neutralForegroundRest,
        transition: "all 0.2s ease-in-out",
        [highContrastSelector]: {
            ...highContrastOptOutProperty,
        },
    },
    pivot_tabList: {
        display: "flex",
        "box-sizing": "border-box",
    },
    pivot_tab: {
        ...applyCursorPointer(),
        height: height(),
        padding: format("0 {0}", horizontalSpacing(focusOutlineWidth)),
        "white-space": "nowrap",
        display: "flex",
        ...applyFocusPlaceholderBorder(),
        "align-items": "center",
        "box-sizing": "border-box",
        "user-select": "none",
        color: neutralForegroundRest,
        ...applyCornerRadius(),
        "&:hover": {
            color: neutralForegroundHover,
            ...highContrastForeground,
        },
        "&:active": {
            color: neutralForegroundActive,
        },
        ...applyFocusVisible<DesignSystem>({
            "border-color": neutralFocus,
            ...highContrastBorderColor,
        }),
        ...highContrastForeground,
    },
    pivot_tab__active: {
        ...highContrastForeground,
    },
    pivot_tabContent: {
        ...applyScaledTypeRamp("t7"),
        position: "relative",
        top: "-2px",
    },
    pivot_activeIndicator: {
        position: "absolute",
        ...applyCornerRadius(),
        top: toPx(subtract(heightNumber(1), activeIndicatorHeight, focusOutlineWidth)),
        left: "-10px",
        transition: "0.2s ease-in-out",
        width: "20px",
        height: toPx(activeIndicatorHeight),
        display: "block",
        background: accentFillRest,
        ...highContrastHighlightBackground,
    },
    pivot_tabPanel: {
        display: "block",
    },
    pivot_tabPanel__hidden: {
        display: "none",
    },
    pivot_tabPanels: {
        "animation-timing-function": "cubic-bezier(0.4, 0.0, 0.6, 1.0)",
    },
    pivot_tabPanels__animatePrevious: {
        animation: format("{0} 0.2s", directionSwitch("fromLeft", "fromRight")),
    },
    pivot_tabPanels__animateNext: {
        animation: format("{0} 0.2s", directionSwitch("fromRight", "fromLeft")),
    },
    pivot_tabPanelContent: {},
    "@keyframes fromRight": {
        "0%": {
            opacity: "0",
            transform: "translateX(-50px)",
        },
        "100%": {
            opacity: "1",
            transform: "translateX(0)",
        },
    },
    "@keyframes fromLeft": {
        "0%": {
            opacity: "0",
            transform: "translateX(50px)",
        },
        "100%": {
            transform: "translateX(0)",
            opacity: "1",
        },
    },
};

export default styles;
