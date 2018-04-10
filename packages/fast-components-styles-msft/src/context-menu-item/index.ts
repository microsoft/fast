import {IDesignSystem} from "../design-system";
import {ComponentStyles} from "@microsoft/fast-jss-manager";
import {IContextMenuItemClassNameContract} from "@microsoft/fast-components-class-name-contracts";

const styles: ComponentStyles<IContextMenuItemClassNameContract, IDesignSystem> = {
    contextMenuItem: {
        color: (config: IDesignSystem): string => {
            return config.foregroundColor;
        },
        backgroundColor: (config: IDesignSystem): string => {
            return config.brandColor;
        }
    },
};

export default styles;
