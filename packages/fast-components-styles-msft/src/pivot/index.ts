import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import {
    applyFocusVisible,
    applyLocalizedProperty,
    Direction,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { applyTypeRampConfig } from "../utilities/typography";
import { density } from "../utilities/density";
import {
    accentFillRest,
    neutralFocus,
    neutralForegroundActive,
    neutralForegroundHover,
    neutralForegroundRest,
} from "../utilities/color";
import { PivotClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";

const styles: ComponentStyles<PivotClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<PivotClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    return {
        pivot: {
            position: "relative",
            overflow: "hidden",
            color: neutralForegroundRest,
            transition: "all 0.2s ease-in-out",
        },
        pivot_tabList: {
            display: "flex",
            boxSizing: "border-box",
        },
        pivot_tab: {
            minHeight: density(32),
            padding: "0 12px",
            whiteSpace: "nowrap",
            display: "flex",
            border: "2px solid",
            borderColor: "transparent",
            alignItems: "center",
            boxSizing: "border-box",
            userSelect: "none",
            color: neutralForegroundRest,
            borderRadius: toPx(designSystem.cornerRadius),
            "&:hover": {
                color: neutralForegroundHover,
            },
            "&:active": {
                color: neutralForegroundActive,
            },
            ...applyFocusVisible<DesignSystem>({
                borderColor: neutralFocus,
            }),
        },
        pivot_tab__active: {},
        pivot_tabContent: {
            transition: "all 0.2s ease-in-out",
            ...applyTypeRampConfig("t7"),
        },
        pivot_activeIndicator: {
            position: "absolute",
            borderRadius: toPx(designSystem.cornerRadius),
            top: density(27),
            left: "-10px",
            transition: "0.2s ease-in-out",
            width: "20px",
            height: "3px",
            display: "block",
            background: accentFillRest,
        },
        pivot_tabPanel: {
            display: "block",
        },
        pivot_tabPanel__hidden: {
            display: "none",
        },
        pivot_tabPanels: {
            animationTimingFunction: "cubic-bezier(0.4, 0.0, 0.6, 1.0)",
        },
        pivot_tabPanels__animatePrevious: {
            animation: `${applyLocalizedProperty(
                "fromLeft",
                "fromRight",
                direction
            )} 0.2s`,
        },
        pivot_tabPanels__animateNext: {
            animation: `${applyLocalizedProperty(
                "fromRight",
                "fromLeft",
                direction
            )} 0.2s`,
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
};

export default styles;
