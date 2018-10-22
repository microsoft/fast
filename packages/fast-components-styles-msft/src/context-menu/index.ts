import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { ContextMenuClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { foregroundLarge } from "../utilities/colors";

const styles: ComponentStyles<ContextMenuClassNameContract, DesignSystem> = {
    contextMenu: {
        border: (config: DesignSystem): string => {
            return `1px solid ${foregroundLarge(config)}`;
        },
        margin: "0",
        padding: "0",
        maxWidth: "369px", // Should really be 368, however chrome draws the border incorrectly at even numbers
        minWidth: "64px",
        borderRadius: "4px",
    },
};

export default styles;
