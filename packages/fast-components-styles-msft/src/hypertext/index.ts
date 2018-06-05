import { IDesignSystem } from "../design-system";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IHypertextClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { toPx } from "@microsoft/fast-jss-utilities";

function applyHypertextBorder(pixels: number): ICSSRules<IDesignSystem> {
    return {
        borderBottom: (config: IDesignSystem): string => {
            return `${toPx(pixels)} solid ${config.brandColor}`;
        }
    };
}

const styles: ComponentStyles<IHypertextClassNameContract, IDesignSystem> = {
    hypertext: {
        outline: toPx(0),
        textDecoration: "none",
        "&[href]": {
            ...applyHypertextBorder(1),
            color: (config: IDesignSystem): string => {
                return config.brandColor;
            },
            "&:hover, &:focus": {
                ...applyHypertextBorder(2)
            }
        }
    }
};

export default styles;
