import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { TextFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { adjustContrast, contrast, toPx } from "@microsoft/fast-jss-utilities";
import { get } from "lodash-es";
import { applyType } from "../utilities/typography";
import { fontWeight } from "../utilities/fonts";
import {
    disabledContrast,
    ensureForegroundNormal,
    ensuresBackgroundNormal,
    foregroundNormal,
    hoverContrast
} from "../utilities/colors";
import { density } from "../utilities/density";
import { defaultHeight, maxHeight, minHeight } from "../utilities/height";

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
            ...applyType("t7", "vp1"),
            color: ensureForegroundNormal,
            background: ensuresBackgroundNormal,
            fontWeight: fontWeight.light.toString(),
            border: `1px solid ${foregroundNormal(designSystem)}`,
            boxSizing: "border-box",
            borderRadius: "2px",
            padding: "10px",
            margin: `${density(designSystem.designUnit * 3)(designSystem)} 0`,
            height: density(defaultHeight)(designSystem),
            minHeight: toPx(minHeight),
            maxHeight: toPx(maxHeight),
            "&:hover": {
                borderColor: hoverColor(designSystem)
            },
            "&:focus": {
                outline: "none",
                boxShadow: `0 0 0 1px inset ${foregroundNormal(designSystem)}`
            },
            "&:disabled": {
                borderColor: disabledColor(designSystem),
                color: disabledColor(designSystem),
                cursor: "not-allowed"
            }
        }
    };
};

export default styles;
