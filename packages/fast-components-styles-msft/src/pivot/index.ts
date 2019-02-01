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
        pivot: {},
        pivot_itemList: {},
        pivot_item: {},
        pivot_item__active: {},
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
