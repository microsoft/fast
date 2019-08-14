import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { SubheadingClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { applyFontWeightNormal } from "../utilities/fonts";

const styles: ComponentStyles<SubheadingClassNameContract, DesignSystem> = {
    subheading: {
        "&$subheading__1, &$subheading__2, &$subheading__3, &$subheading__4, &$subheading__5, &$subheading__6, &$subheading__7": {
            ...applyFontWeightNormal(),
        }
    },
    subheading__1: {},
    subheading__2: {},
    subheading__3: {},
    subheading__4: {},
    subheading__5: {},
    subheading__6: {},
    subheading__7: {},
};

export default styles;
