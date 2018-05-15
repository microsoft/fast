import { IDesignSystem } from "../design-system";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { ITextFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { toPx } from "@microsoft/fast-jss-utilities";
import { applyType } from "../utilities/typography";
import * as Chroma from "chroma-js";

function applyMixedColor(mixValue?: number, alpha?: number): (config: IDesignSystem) => string {
    return function applyColors(config: IDesignSystem): string {
        if (alpha) {
            return Chroma.mix(config.foregroundColor, config.backgroundColor, mixValue).alpha(alpha).css();
        } else {
            return Chroma.mix(config.foregroundColor, config.backgroundColor, mixValue).css();
        }
    };
}

const styles: ComponentStyles<ITextFieldClassNameContract, IDesignSystem> = {
    textField: {
        ...applyType("t7", "vp1"),
        color: applyMixedColor(0.46),
        fontWeight: "100",
        outline: `${toPx(1)} solid transparent`,
        border: `${toPx(1)} solid transparent`,
        borderColor: applyMixedColor(0.46),
        boxSizing: "border-box",
        borderRadius: toPx(2),
        padding: toPx(10),
        margin: toPx(10),
        "&:focus": {
            outlineColor: applyMixedColor(0.38),
            borderColor: applyMixedColor(0.38)
        },
        "&:disabled": {
            background: (config: IDesignSystem): string => {
                return config.backgroundColor;
            },
            borderColor: applyMixedColor(0.863),
            color: applyMixedColor(0.80),
            cursor: "not-allowed"
        }
    }
};

export default styles;
