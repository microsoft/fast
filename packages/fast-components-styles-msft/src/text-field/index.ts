import { applyTypeRampConfig } from "../utilities/typography";
import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { TextFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { adjustContrast, contrast, toPx } from "@microsoft/fast-jss-utilities";
import { get } from "lodash-es";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { fontWeight } from "../utilities/fonts";
import {
    disabledContrast,
    ensureForegroundNormal,
    foregroundNormal,
    hoverContrast,
} from "../utilities/colors";
import { density } from "../utilities/density";
import { defaultHeight, maxHeight, minHeight } from "../utilities/height";
import outlinePattern from "../patterns/outline";

/**
 * Retrieves the disabled color
 */
function disabledColor(config: DesignSystem): string {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    return disabledContrast(
        designSystem.contrast,
        foregroundNormal(designSystem),
        designSystem.backgroundColor
    );
}

function hoverColor(config: DesignSystem): string {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    return hoverContrast(
        designSystem.contrast,
        foregroundNormal(designSystem),
        designSystem.backgroundColor
    );
}

const styles: ComponentStyles<TextFieldClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<TextFieldClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

    return {
        textField: {
            ...applyTypeRampConfig("t7"),
            ...outlinePattern.rest,
            color: ensureForegroundNormal,
            fontWeight: fontWeight.light.toString(),
            boxSizing: "border-box",
            borderRadius: toPx(designSystem.cornerRadius),
            padding: "10px",
            margin: `${density(designSystem.designUnit * 3)(designSystem)} 0`,
            height: density(defaultHeight)(designSystem),
            minHeight: toPx(minHeight),
            maxHeight: toPx(maxHeight),
            "&:hover": {
                ...outlinePattern.hover,
            },
            "&:focus": {
                outline: "none",
                ...outlinePattern.focus,
            },
            "&:disabled": {
                ...outlinePattern.disabled,
                color: disabledColor(designSystem),
                cursor: "not-allowed",
            },
        },
    };
};

export default styles;
