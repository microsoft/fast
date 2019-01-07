import { applyTypeRampConfig } from "../utilities/typography";
import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { TextFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { focusVisible, toPx } from "@microsoft/fast-jss-utilities";
import { get } from "lodash-es";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { fontWeight } from "../utilities/fonts";
import { foregroundNormal } from "../utilities/colors";
import { density } from "../utilities/density";
import { defaultHeight, maxHeight, minHeight } from "../utilities/height";
import outlinePattern from "../patterns/outline";
import typographyPattern from "../patterns/typography";

const styles: ComponentStyles<TextFieldClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<TextFieldClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

    return {
        textField: {
            ...applyTypeRampConfig("t7"),
            ...outlinePattern.rest,
            ...typographyPattern.rest,
            fontWeight: fontWeight.light.toString(),
            boxSizing: "border-box",
            borderRadius: toPx(designSystem.cornerRadius),
            padding: "10px",
            margin: "0",
            height: density(defaultHeight)(designSystem),
            minHeight: toPx(minHeight),
            maxHeight: toPx(maxHeight),
            "&:hover": {
                ...outlinePattern.hover,
            },
            "&:focus": {
                outline: "none",
            },
            [`&${focusVisible()}`]: {
                outline: "none",
                ...outlinePattern.focus,
            },
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
