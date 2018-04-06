import { IDesignSystem } from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { IHypertextClassNameContract } from "@microsoft/fast-components-class-name-contracts";
import { toPx } from "../utilities/units";

const styles: ComponentStyles<IHypertextClassNameContract, IDesignSystem> = {
    hypertext: {
        borderBottom: (config: IDesignSystem): string => {
            return `1px solid ${config.brandColor}`;
        },
        color: (config: IDesignSystem): string => {
            return config.brandColor;
        },
        outline: toPx(0),
        textDecoration: "none",
        "&:hover, &:focus": {
            borderBottom: (config: IDesignSystem): string => {
                return `2px solid ${config.brandColor}`;
            }
        }
    }
};

export default styles;
