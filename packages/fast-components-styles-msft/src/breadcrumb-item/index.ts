import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { ensureBrandNormal, ensureForegroundNormal } from "../utilities/colors";
import { BreadcrumbItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyTypeRampConfig } from "../utilities/typography";
import { fontWeight } from "../utilities/fonts";
import { toPx } from "@microsoft/fast-jss-utilities";

function applyHypertextBorder(pixels: number): CSSRules<DesignSystem> {
    return {
        borderBottom: (config: DesignSystem): string => {
            return `${toPx(pixels)} solid ${ensureBrandNormal(config)}`;
        },
    };
}

const styles: ComponentStyles<BreadcrumbItemClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<BreadcrumbItemClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

    return {
        breadcrumbItem: {
            fontWeight: `${fontWeight.bold}`,
            ...applyTypeRampConfig("t7"),
        },
        breadcrumbItem__current: {},
        breadcrumbItem__hypertext: {
            outline: "none",
            textDecoration: "none",
            color: ensureForegroundNormal,
            "&[href]": {
                color: ensureBrandNormal,
                "&:hover, &:focus": {
                    ...applyHypertextBorder(2),
                },
            },
        },
    };
};

export default styles;
