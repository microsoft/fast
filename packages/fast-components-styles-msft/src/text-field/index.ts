import { IDesignSystem } from "../design-system";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { ITextFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { toPx } from "@microsoft/fast-jss-utilities";
import { applyType } from "../utilities/typography";
import * as Chroma from "chroma-js";

function applyMixedColor(incomingProperty: string, mixValue?: number, alpha?: number): ICSSRules<IDesignSystem> {

    function applyColors(config: IDesignSystem): string {
        if (alpha) {
            return Chroma.mix(config.foregroundColor, config.backgroundColor, mixValue).alpha(alpha).css();
        } else {
            return Chroma.mix(config.foregroundColor, config.backgroundColor, mixValue).css();
        }
    }

    switch (incomingProperty) {
        case "background":
            return {background: (config: IDesignSystem): string => {
                return applyColors(config);
            }
        };
        case "backgroundColor":
            return {backgroundColor: (config: IDesignSystem): string => {
                return applyColors(config);
            }
        };
        case "borderColor":
            return {borderColor: (config: IDesignSystem): string => {
                return applyColors(config);
            }
        };
        case "color":
            return {color: (config: IDesignSystem): string => {
                return applyColors(config);
            }
        };
        case "outlineColor":
            return {outlineColor: (config: IDesignSystem): string => {
                return applyColors(config);
            }
        };
    }
}

const styles: ComponentStyles<ITextFieldClassNameContract, IDesignSystem> = {
    textField: {
        ...applyType("t7", "vp1"),
        ...applyMixedColor("color", 0.46),
        fontWeight: "100",
        outline: `${toPx(1)} solid transparent`,
        border: `${toPx(1)} solid transparent`,
        ...applyMixedColor("borderColor", 0.46),
        boxSizing: "border-box",
        borderRadius: toPx(2),
        padding: toPx(10),
        margin: toPx(10),
        "&:focus": {
            ...applyMixedColor("outlineColor", 0.38),
            ...applyMixedColor("borderColor", 0.38)
        },
        "&:disabled": {
            background: (config: IDesignSystem): string => {
                return config.backgroundColor;
            },
            ...applyMixedColor("borderColor", 0.863),
            ...applyMixedColor("color", 0.80),
            cursor: "not-allowed"
        }
    }
};

export default styles;
