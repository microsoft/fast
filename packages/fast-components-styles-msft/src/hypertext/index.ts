import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import {
    accentFillRest,
    neutralForegroundRest,
    neutralOutlineHover,
} from "../utilities/color";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { HypertextClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyFocusVisible } from "@microsoft/fast-jss-utilities";

const styles: ComponentStyles<HypertextClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<HypertextClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

    return {
        hypertext: {
            outline: "none",
            textDecoration: "none",
            color: neutralForegroundRest,
            "&:link, &:visited": {
                borderBottom: `1px solid ${accentFillRest(designSystem)}`,
                color: accentFillRest,
                "&:hover": {
                    borderBottom: `2px solid ${accentFillRest(designSystem)}`,
                },
                ...applyFocusVisible({
                    borderBottom: `2px solid ${designSystem.foregroundColor}`,
                }),
            },
        },
    };
};

export default styles;
