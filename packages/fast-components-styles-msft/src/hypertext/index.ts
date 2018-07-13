import designSystemDefaults, { IDesignSystem } from "../design-system";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IHypertextClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash-es";
import { toPx } from "@microsoft/fast-jss-utilities";

function applyHypertextBorder(pixels: number): ICSSRules<IDesignSystem> {
    return {
        borderBottom: (config: IDesignSystem): string => {
            return `${toPx(pixels)} solid ${get(config, "brandColor") || designSystemDefaults.brandColor}`;
        }
    };
}

const styles: ComponentStyles<IHypertextClassNameContract, IDesignSystem> = {
    hypertext: {
        outline: toPx(0),
        textDecoration: "none",
        color: (config: IDesignSystem): string => {
            return get(config, "foregroundColor") || designSystemDefaults.foregroundColor;
        },
        "&[href]": {
            ...applyHypertextBorder(1),
            color: (config: IDesignSystem): string => {
                return get(config, "brandColor") || designSystemDefaults.brandColor;
            },
            "&:hover, &:focus": {
                ...applyHypertextBorder(2)
            }
        }
    }
};

export default styles;
