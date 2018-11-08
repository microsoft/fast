import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { ensureForegroundNormal } from "../utilities/colors";
import { BreadcrumbClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyTypeRampConfig } from "../utilities/typography";
import { fontWeight } from "../utilities/fonts";

const styles: ComponentStyles<BreadcrumbClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<BreadcrumbClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

    return {
        breadcrumb: {
            padding: "4px",
            "& ol": {
                listStyle: "none",
                paddingLeft: "0",
                margin: "0",
                display: "flex",
                flexWrap: "wrap",
            },
            "& li": {
                display: "inline",
            },
            "& span": {
                display: "inline-block",
            },
        },
        breadcrumb__seperator: {
            fontWeight: `${fontWeight.normal}`,
            ...applyTypeRampConfig("t7"),
            color: ensureForegroundNormal,
            margin: "0 6px",
        },
    };
};

export default styles;
