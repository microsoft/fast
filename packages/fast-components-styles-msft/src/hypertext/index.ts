import designSystemDefaults, { DesignSystem } from "../design-system";
import { ensureBrandNormal, ensureForegroundNormal } from "../utilities/colors";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { HypertextClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash-es";
import { toPx } from "@microsoft/fast-jss-utilities";

function applyHypertextBorder(pixels: number): CSSRules<DesignSystem> {
    return {
        borderBottom: (config: DesignSystem): string => {
            return `${toPx(pixels)} solid ${ensureBrandNormal(config)}`;
        },
    };
}

const styles: ComponentStyles<HypertextClassNameContract, DesignSystem> = {
    hypertext: {
        outline: "none",
        textDecoration: "none",
        color: ensureForegroundNormal,
        // remove [href] attribute in favor of link and visited <======
        "&:link, &:visited": {
            ...applyHypertextBorder(1),
            color: ensureBrandNormal,
            "&:hover, &:focus": {
                ...applyHypertextBorder(2),
            },
        },
    },
};

export default styles;
