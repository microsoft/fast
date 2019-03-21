import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { LabelClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyScreenReader } from "@microsoft/fast-jss-utilities";
import { neutralForegroundRest } from "../utilities/color";
import { scaleApplyTypeRampConfigWithDensity } from "../utilities/typography";

const styles: ComponentStyles<LabelClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<LabelClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

    return {
        label: {
            ...scaleApplyTypeRampConfigWithDensity(designSystem, "t7"),
            display: "inline-block",
            color: neutralForegroundRest,
            padding: "0",
        },
        label__hidden: {
            ...applyScreenReader(),
        },
    };
};

export default styles;
