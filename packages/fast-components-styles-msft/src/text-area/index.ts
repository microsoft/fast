import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { TextAreaClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { toPx } from "@microsoft/fast-jss-utilities";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { density } from "../utilities/density";
import { defaultHeight, maxHeight, minHeight } from "../utilities/height";
import { inputFieldStyles } from "../patterns/input-field";

const styles: ComponentStyles<TextAreaClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<TextAreaClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

    return {
        textArea: {
            ...inputFieldStyles(designSystem),
            height: density(defaultHeight * 2)(designSystem),
            minHeight: toPx(minHeight * 2),
            maxHeight: toPx(maxHeight * 2),
            maxWidth: "100%",
        },
    };
};

export default styles;
