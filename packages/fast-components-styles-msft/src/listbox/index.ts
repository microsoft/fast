import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { ListboxClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { foregroundLarge } from "../utilities/colors";
import { elevation, ElevationMultiplier } from "../utilities/elevation";
import { toPx } from "@microsoft/fast-jss-utilities";

const styles: ComponentStyles<ListboxClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<ListboxClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

    return {
        listbox: {
            padding: "4px 0",
            maxWidth: "368px",
            minWidth: "64px",
        },
    };
};

export default styles;
