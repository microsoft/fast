import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { neutralOutlineRest } from "../utilities/color";
import { DividerClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

const styles: ComponentStyles<DividerClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<DividerClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

    return {
        divider: {
            boxSizing: "content-box",
            height: "0",
            margin: "0",
            border: "none",
            borderTop: `1px solid ${neutralOutlineRest(designSystem)}`,
            transition: "all 0.2s ease-in-out",
        },
    };
};

export default styles;
