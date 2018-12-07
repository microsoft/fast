import designSystemDefaults, { DesignSystem } from "../design-system";
import { ensureBrandNormal, ensureForegroundNormal } from "../utilities/colors";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { HypertextClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { focusVisible } from "@microsoft/fast-jss-utilities";

const styles: ComponentStyles<HypertextClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<HypertextClassNameContract, DesignSystem> => {
    return {
        hypertext: {
            outline: "none",
            textDecoration: "none",
            color: ensureForegroundNormal,
            "&:link, &:visited": {
                borderBottom: `1px solid ${ensureBrandNormal(config)}`,
                color: ensureBrandNormal,
                [`&:hover, &${focusVisible()}`]: {
                    borderBottom: `2px solid ${ensureBrandNormal(config)}`,
                },
            },
        },
    };
};

export default styles;
