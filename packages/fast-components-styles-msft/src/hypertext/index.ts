import designSystemDefaults, { IDesignSystem } from "../design-system";
import { brandNormal, foregroundNormal } from "../utilities/colors";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IHypertextClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash-es";
import { toPx } from "@microsoft/fast-jss-utilities";

function applyHypertextBorder(pixels: number): ICSSRules<IDesignSystem> {
    return {
        borderBottom: (config: IDesignSystem): string => {
            return `${toPx(pixels)} solid ${brandNormal(config)}`;
        }
    };
}

const styles: ComponentStyles<IHypertextClassNameContract, IDesignSystem> = {
    hypertext: {
        outline: "none",
        textDecoration: "none",
        color: foregroundNormal,
        "&[href]": {
            ...applyHypertextBorder(1),
            color: brandNormal,
            "&:hover, &:focus": {
                ...applyHypertextBorder(2)
            }
        }
    }
};

export default styles;
