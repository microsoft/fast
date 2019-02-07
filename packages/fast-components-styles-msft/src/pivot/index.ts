import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { applyLocalizedProperty, Direction } from "@microsoft/fast-jss-utilities";
import { hoverContrast } from "../utilities/colors";
import { PivotClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";

const styles: ComponentStyles<PivotClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<PivotClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    return {
        pivot: {
            color: "black",
            position: "relative",
        },
        pivot_itemList: {
            display: "flex",
        },
        pivot_item: {
            minHeight: "32px",
            padding: "0 12px",
            fontSize: "14px",
            whiteSpace: "nowrap",
            "&:hover": {
                opacity: "0.8",
            },
            "&:focus": {
                outline: "none",
                opacity: "0.6",
            },
        },
        pivot_item__active: {},
        pivot_item__activeIndicator: {
            position: "absolute",
            borderRadius: "2px",
            top: "24px",
            left: "-10px",
            transition: "0.2s ease-in-out",
            width: "20px",
            height: "3px",
            display: "block",
            background: "purple",
        },
        pivot_tabPanel: {
            display: "block",
        },
        pivot_tabPanel__hidden: {
            display: "none",
        },
        pivot_tabPanels: {},
        pivot_tabPanelContent: {},
    };
};

export default styles;
