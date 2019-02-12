import { applyTypeRampConfig } from "../utilities/typography";
import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { TextAreaClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyFocusVisible, toPx } from "@microsoft/fast-jss-utilities";
import { get } from "lodash-es";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { fontWeight } from "../utilities/fonts";
import {
    disabledContrast,
    ensureForegroundNormal,
    foregroundNormal,
} from "../utilities/colors";
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
