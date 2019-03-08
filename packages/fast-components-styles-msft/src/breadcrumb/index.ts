import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { applyLocalizedProperty, Direction } from "@microsoft/fast-jss-utilities";
import { accentForegroundRest, neutralForegroundRest } from "../utilities/color";
import { BreadcrumbClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyTypeRampConfig } from "../utilities/typography";
import { fontWeight } from "../utilities/fonts";

const styles: ComponentStyles<BreadcrumbClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<BreadcrumbClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    return {
        breadcrumb: {
            color: neutralForegroundRest,
            ...applyTypeRampConfig("t7"),
        },
        breadcrumb_item: {
            fontWeight: `${fontWeight.semibold}`,
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
            fontWeight: `${fontWeight.normal}`,
            display: "inline-block",
            margin: "0 6px",
        },
    };
};

export default styles;
