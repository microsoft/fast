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
            ...elevation(ElevationMultiplier.e11, designSystem.foregroundColor)(
                designSystem
            ),
            margin: "0",
            padding: "4px 0",
            maxWidth: "368px",
            minWidth: "64px",
            borderRadius: "4px",
        },
    };
};

export default styles;
