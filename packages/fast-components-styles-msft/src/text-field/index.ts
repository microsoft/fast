import { applyTypeRampConfig } from "../utilities/typography";
import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { TextFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyFocusVisible, toPx } from "@microsoft/fast-jss-utilities";
import { get } from "lodash-es";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { fontWeight } from "../utilities/fonts";
import { foregroundNormal } from "../utilities/colors";
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
            "&:hover": {
                ...outlinePattern.hover,
            },
            ...applyFocusVisible({
                ...outlinePattern.focus,
            }),
            "&:disabled": {
                ...outlinePattern.disabled,
                ...typographyPattern.disabled,
                cursor: "not-allowed",
                "&::placeholder": {
                    ...typographyPattern.disabled,
                },
            },
            "&::placeholder": {
                color: foregroundNormal,
            },
        },
    };
};

export default styles;
