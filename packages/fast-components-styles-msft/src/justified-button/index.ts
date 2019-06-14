import { ButtonBaseClassNameContract as JustifiedButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";
import { baseButton, lightweightButtonStyles } from "../patterns/button";

const styles: ComponentStyles<JustifiedButtonClassNameContract, DesignSystem> = {
    ...baseButton,
    button: {
        ...lightweightButtonStyles(),
        justifyContent: "flex-start",
        // specificity is required here to ensure the new values override those passed in the lightweightButtonStyles function
        "a&, button&": {
            paddingLeft: "0",
            paddingRight: "0",
            borderWidth: "0",
        },
    },
};

export default styles;
