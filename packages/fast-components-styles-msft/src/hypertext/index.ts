import {IDesignSystem} from "../design-system";
import {ComponentStyles} from "@microsoft/fast-jss-manager";
import {IHypertextClassNameContract} from "@microsoft/fast-components-class-name-contracts";

const styles: ComponentStyles<IHypertextClassNameContract, IDesignSystem> = {
    hypertext: {
        borderBottom: (config: IDesignSystem): string => {
            return `1px solid ${config.brandColor}`;
        },
        color: (config: IDesignSystem): string => {
            return config.brandColor;
        },
        "&:hover, &:focus": {
            borderBottom: (config: IDesignSystem): string => {
                return `2px solid ${config.brandColor}`;
            }
        }
    }
};

export default styles;
