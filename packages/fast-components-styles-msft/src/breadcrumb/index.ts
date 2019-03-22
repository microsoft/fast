import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { applyLocalizedProperty, Direction } from "@microsoft/fast-jss-utilities";
import {
    accentForegroundRest,
    neutralForegroundHint,
    neutralForegroundRest,
} from "../utilities/color";
import { BreadcrumbClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyCursorDefault } from "../utilities/cursor";
import { applyScaledTypeRamp } from "../utilities/typography";

const styles: ComponentStyles<BreadcrumbClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<BreadcrumbClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    return {
        breadcrumb: {
            color: neutralForegroundRest,
            ...applyScaledTypeRamp(designSystem, "t7"),
            ...applyCursorDefault(),
        },
        breadcrumb_item: {
            display: "inline",
            outline: "none",
            textDecoration: "none",
            transition: "all 0.2s ease-in-out",
            "&:link, &:visited": {
                color: accentForegroundRest,
                borderBottom: "0px",
            },
        },
        breadcrumb_itemsContainer: {
            listStyle: "none",
            [applyLocalizedProperty("paddingLeft", "paddingRight", direction)]: "0",
            margin: "0",
            display: "flex",
            flexWrap: "wrap",
        },
        breadcrumb_separator: {
            display: "inline-block",
            ...applyCursorDefault(),
            color: neutralForegroundHint,
            margin: "0 6px",
        },
    };
};

export default styles;
