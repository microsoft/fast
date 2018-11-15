import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { applyLocalizedProperty, Direction } from "@microsoft/fast-jss-utilities";
import { ensureForegroundNormal } from "../utilities/colors";
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
            padding: "4px",
        },
        breadcrumb_item: {
            fontWeight: `${fontWeight.bold}`,
            display: "inline",
            ...applyTypeRampConfig("t7"),
        },
        breadcrumb_item__current: {},
        breadcrumb_ol: {
            listStyle: "none",
            [applyLocalizedProperty("paddingLeft", "paddingRight", direction)]: "0",
            margin: "0",
            display: "flex",
            flexWrap: "wrap",
        },
        breadcrumb_seperator: {
            fontWeight: `${fontWeight.normal}`,
            display: "inline-block",
            ...applyTypeRampConfig("t7"),
            color: ensureForegroundNormal,
            margin: "0 6px",
        },
    };
};

export default styles;
