import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { TextAreaClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { height } from "../utilities/density";
import { inputFieldStyles } from "../patterns/input-field";
import { format, multiply, toPx } from "@microsoft/fast-jss-utilities";
import { designUnit, outlineWidth } from "../utilities/design-system";

const styles: ComponentStyles<TextAreaClassNameContract, DesignSystem> = {
    textArea: {
        ...inputFieldStyles(),
        height: height(2),
        paddingTop: toPx(multiply(designUnit, 1.5)),
        paddingBottom: toPx(multiply(designUnit, 1.5)),
        maxWidth: "100%",
        "@media (-ms-high-contrast:active)": {
            border: format(
                "{0} solid ButtonText",
                toPx<DesignSystem>(outlineWidth)
            ),
        },
        "&:disabled": {
            "@media (-ms-high-contrast:active)": {
                background: "Background",
                borderColor: "GrayText"
            }
        }
    },
};

export default styles;
