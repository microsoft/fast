import { DesignSystem } from "../design-system";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { SubheadingClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { fontWeight } from "../utilities/fonts";

const styles: ComponentStyles<SubheadingClassNameContract, DesignSystem> = {
    subheading: {
        fontWeight: `${fontWeight.normal}`,
    },
    subheading__1: {},
    subheading__2: {},
    subheading__3: {},
    subheading__4: {},
    subheading__5: {},
    subheading__6: {},
};

export default styles;
