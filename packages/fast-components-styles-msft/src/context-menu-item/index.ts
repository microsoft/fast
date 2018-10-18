import { DesignSystem } from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { ContextMenuItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

const styles: ComponentStyles<ContextMenuItemClassNameContract, DesignSystem> = {
    contextMenuItem: {
        color: (config: DesignSystem): string => {
            return config.foregroundColor;
        },
        backgroundColor: (config: DesignSystem): string => {
            return config.brandColor;
        },
    },
};

export default styles;
