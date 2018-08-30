import designSystemDefaults, { IDesignSystem } from "../design-system";
import { ensureBrandNormal, ensureForegroundNormal } from "../utilities/colors";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IHypertextClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash-es";
import { toPx } from "@microsoft/fast-jss-utilities";

function applyHypertextBorder(pixels: number): ICSSRules<IDesignSystem> {
    return {
        borderBottom: (config: IDesignSystem): string => {
            return `${toPx(pixels)} solid ${ensureBrandNormal(config)}`;
        }
    };
}

const styles: ComponentStyles<IHypertextClassNameContract, IDesignSystem> = {
    hypertext: {
        outline: "none",
        textDecoration: "none",
        color: ensureForegroundNormal,
        "&[href]": {
            ...applyHypertextBorder(1),
            color: ensureBrandNormal,
            "&:hover, &:focus": {
                ...applyHypertextBorder(2)
            }
        }
    }
};

export default styles;
