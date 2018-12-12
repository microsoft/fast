import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import {
    applyLocalizedProperty,
    Direction,
    focusVisible,
} from "@microsoft/fast-jss-utilities";
import { ensureBrandNormal, ensureForegroundNormal } from "../utilities/colors";
import { BreadcrumbClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyTypeRampConfig } from "../utilities/typography";
import { fontWeight } from "../utilities/fonts";
import typographyPattern from "../patterns/typography";

const styles: ComponentStyles<BreadcrumbClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<BreadcrumbClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    return {
        breadcrumb_item: {
            fontWeight: `${fontWeight.bold}`,
            display: "inline",
            outline: "none",
            textDecoration: "none",
            ...typographyPattern.rest,
            ...applyTypeRampConfig("t7"),
            "&:link, &:visited": {
                color: ensureBrandNormal,
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
            ...applyTypeRampConfig("t7"),
            ...typographyPattern.rest,
            margin: "0 6px",
        },
    };
};

export default styles;
