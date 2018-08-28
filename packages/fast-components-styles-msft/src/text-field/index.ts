import designSystemDefaults, { IDesignSystem, safeDesignSystem } from "../design-system";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { ITextFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { adjustContrast, contrast, toPx } from "@microsoft/fast-jss-utilities";
import { get } from "lodash-es";
import { applyType } from "../utilities/typography";
import { fontWeight } from "../utilities/fonts";
import { disabledContrast, ensureForegroundNormal, ensuresBackgroundNormal, foregroundNormal, hoverContrast  } from "../utilities/colors";

/**
 * Retrieves the disabled color
 */
function disabledColor(config: IDesignSystem): string {
    const designSystem: IDesignSystem = safeDesignSystem(config);
    return disabledContrast(designSystem.contrast, foregroundNormal(designSystem), designSystem.backgroundColor);
}

function hoverColor(config: IDesignSystem): string {
    const designSystem: IDesignSystem = safeDesignSystem(config);
    return hoverContrast(designSystem.contrast, foregroundNormal(designSystem), designSystem.backgroundColor);
}

const styles: ComponentStyles<ITextFieldClassNameContract, IDesignSystem> = {
    textField: {
        ...applyType("t7", "vp1"),
        color: ensureForegroundNormal,
        background: ensuresBackgroundNormal,
        fontWeight: fontWeight.light.toString(),
        border: "1px solid transparent",
        borderColor: foregroundNormal,
        boxSizing: "border-box",
        borderRadius: "2px",
        padding: "10px",
        margin: "10px",
        "&:hover": {
            borderColor: hoverColor
        },
        "&:focus": {
            outline: "none",
            boxShadow: (config: IDesignSystem): string => {
                return `0 0 0 1px inset ${foregroundNormal(config)}`;
            }
        },
        "&:disabled": {
            borderColor: disabledColor,
            color: disabledColor,
            cursor: "not-allowed"
        }
    }
};

export default styles;
