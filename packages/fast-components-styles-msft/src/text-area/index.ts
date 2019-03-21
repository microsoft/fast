import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { TextAreaClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { height } from "../utilities/density";
import { inputFieldStyles } from "../patterns/input-field";
import { toPx } from "@microsoft/fast-jss-utilities";

const styles: ComponentStyles<TextAreaClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<TextAreaClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

    return {
        textArea: {
            ...inputFieldStyles(designSystem),
            height: height(2),
            paddingTop: toPx(designSystem.designUnit * 1.5),
            paddingBottom: toPx(designSystem.designUnit * 1.5),
            maxWidth: "100%",
        },
    };
};

export default styles;
