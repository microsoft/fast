import designSystemDefaults, { IDesignSystem } from "../design-system";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { ITextFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { toPx } from "@microsoft/fast-jss-utilities";
import { get } from "lodash-es";
import { applyType } from "../utilities/typography";
import { fontWeight } from "../utilities/fonts";
import { applyMixedColor } from "../utilities/colors";

function applyTextFieldMixedColor(mixValue?: number): (config: IDesignSystem) => string {
    return (config: IDesignSystem): string =>
        applyMixedColor(
            get(config, "foregroundColor") || designSystemDefaults.foregroundColor,
            get(config, "backgroundColor") || designSystemDefaults.backgroundColor,
            mixValue
        );
}

const styles: ComponentStyles<ITextFieldClassNameContract, IDesignSystem> = {
    textField: {
        ...applyType("t7", "vp1"),
        color: applyTextFieldMixedColor(0.46),
        fontWeight: fontWeight.light.toString(),
        outline: `${toPx(1)} solid transparent`,
        border: `${toPx(1)} solid transparent`,
        borderColor: applyTextFieldMixedColor(0.46),
        boxSizing: "border-box",
        borderRadius: toPx(2),
        padding: toPx(10),
        margin: toPx(10),
        "&:focus": {
            outlineColor: applyTextFieldMixedColor(0.38),
            borderColor: applyTextFieldMixedColor(0.38)
        },
        "&:disabled": {
            background: (config: IDesignSystem): string => {
                return get(config, "backgroundColor") || designSystemDefaults.backgroundColor;
            },
            borderColor: applyTextFieldMixedColor(0.863),
            color: applyTextFieldMixedColor(0.80),
            cursor: "not-allowed"
        }
    }
};

export default styles;
