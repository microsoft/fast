import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { ContextMenuClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { elevation, ElevationMultiplier } from "../utilities/elevation";
import { toPx } from "@microsoft/fast-jss-utilities";

const styles: ComponentStyles<ContextMenuClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<ContextMenuClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

    return {
        contextMenu: {
            ...elevation(ElevationMultiplier.e11, "#000")(designSystem),
            margin: "0",
            padding: "4px 0",
            maxWidth: "368px",
            minWidth: "64px",
            background: designSystem.backgroundColor,
            borderRadius: toPx(designSystem.cornerRadius * 2),
        },
    };
};

export default styles;
