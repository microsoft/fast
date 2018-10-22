import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { ContextMenuClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { foregroundLarge } from "../utilities/colors";
import { elevation, ElevationMultiplier } from "../utilities/elevation";

const styles: ComponentStyles<ContextMenuClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<ContextMenuClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

    return {
        contextMenu: {
            border: `1px solid ${foregroundLarge(designSystem)}`,
            ...elevation(ElevationMultiplier.e4, designSystem.foregroundColor)(
                designSystem
            ),
            margin: "0",
            padding: "0",
            maxWidth: "369px", // Should really be 368, however chrome draws the border incorrectly at even numbers
            minWidth: "64px",
            borderRadius: "4px",
        },
    };
};

export default styles;
