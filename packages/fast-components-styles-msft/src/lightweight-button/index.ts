import { ButtonBaseClassNameContract as LightweightButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";
import { baseButton, lightweightButtonStyles } from "../patterns/button";

const styles: ComponentStyles<LightweightButtonClassNameContract, DesignSystem> = {
    ...baseButton,
    button: {
        ...lightweightButtonStyles(),
    },
};

export default styles;
