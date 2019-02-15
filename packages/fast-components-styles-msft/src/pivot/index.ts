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
import { ensureBrandNormal, hoverContrast } from "../utilities/colors";
import outlinePattern from "../patterns/outline";
import { PivotClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";

const styles: ComponentStyles<PivotClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<PivotClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    return {
        pivot: {
            position: "relative",
            color: designSystem.foregroundColor,
            overflow: "hidden",
        },
        pivot_tabList: {
            display: "flex",
            boxSizing: "border-box",
        },
        pivot_tab: {
            minHeight: "32px",
            padding: "0 12px",
            fontSize: "14px",
            whiteSpace: "nowrap",
            display: "flex",
            border: "1px solid",
            borderColor: "transparent",
            alignItems: "center",
            boxSizing: "border-box",
            userSelect: "none",
            borderRadius: toPx(designSystem.cornerRadius),
            "&:hover": {
                opacity: "0.8",
            },
            "&:active": {
                opacity: "0.6",
            },
            ...applyFocusVisible({}),
        },
        pivot_tab__active: {},
        pivot_activeIndicator: {
            position: "absolute",
            borderRadius: toPx(designSystem.cornerRadius),
            top: "27px",
            left: "-10px",
            transition: "0.2s ease-in-out",
            width: "20px",
            height: "3px",
            display: "block",
            background: ensureBrandNormal,
        },
        pivot_activeIndicator__focused: {
            width: "30px",
            left: "-15px",
            background: "black",
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
        pivot_tabPanels__fromLeft: {
            animation: "fromLeft 0.2s",
        },
        pivot_tabPanels__fromRight: {
            animation: "fromRight 0.2s",
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
