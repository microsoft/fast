import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { NumberFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyFocusVisible, toPx } from "@microsoft/fast-jss-utilities";
import { density } from "../utilities/density";
import { defaultHeight, maxHeight, minHeight } from "../utilities/height";
import { foregroundNormal } from "../utilities/colors";
import outlinePattern from "../patterns/outline";
import typographyPattern from "../patterns/typography";
import { applyTypeRampConfig } from "../utilities/typography";
import { fontWeight } from "../utilities/fonts";

/* tslint:disable-next-line */
const styles: ComponentStyles<NumberFieldClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<NumberFieldClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

    return {
        numberField: {
            ...applyTypeRampConfig("t7"),
            ...outlinePattern.rest,
            ...typographyPattern.rest,
            fontFamily: "inherit",
            fontWeight: fontWeight.normal.toString(),
            boxSizing: "border-box",
            borderRadius: toPx(designSystem.cornerRadius),
            padding: "10px",
            margin: "0",
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
            height: density(defaultHeight)(designSystem),
            minHeight: toPx(minHeight),
            maxHeight: toPx(maxHeight),
        },
    };
};

export default styles;
