import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { TextFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { toPx } from "@microsoft/fast-jss-utilities";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { density } from "../utilities/density";
import { defaultHeight, maxHeight, minHeight } from "../utilities/height";
import { inputFieldStyles } from "../patterns/input-field";

const styles: ComponentStyles<TextFieldClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<TextFieldClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

    return {
        textField: {
            ...inputFieldStyles(designSystem),
            height: density(defaultHeight)(designSystem),
            minHeight: toPx(minHeight),
            maxHeight: toPx(maxHeight),
        },
    };
};

export default styles;
