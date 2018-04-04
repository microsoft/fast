import {IDesignSystem} from "../design-system";
import {ComponentStyles} from "@microsoft/fast-jss-manager";
import {IHypertextClassNameContract} from "@microsoft/fast-components-class-name-contracts";

const styles: ComponentStyles<IHypertextClassNameContract, IDesignSystem> = {
    hypertext: {
        color: (config: IDesignSystem): string => {
            return config.foregroundColor;
        },
        backgroundColor: (config: IDesignSystem): string => {
            return config.brandColor;
        }
    },
};

export default styles;
