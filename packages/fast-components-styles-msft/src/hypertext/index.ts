import { IDesignSystem } from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { IHypertextClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { toPx } from "@microsoft/fast-jss-utilities";

const styles: ComponentStyles<IHypertextClassNameContract, IDesignSystem> = {
    hypertext: {
        borderBottom: (config: IDesignSystem): string => {
            return `${toPx(1)} solid ${config.brandColor}`;
        },
        color: (config: IDesignSystem): string => {
            return config.brandColor;
        },
        outline: toPx(0),
        textDecoration: "none",
        "&:hover, &:focus": {
            borderBottom: (config: IDesignSystem): string => {
                return `${toPx(2)} solid ${config.brandColor}`;
            }
        }
    }
};

export default styles;
