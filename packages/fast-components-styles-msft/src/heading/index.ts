import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { HeadingClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { applyFontWeightSemiBold } from "../utilities/fonts";

const styles: ComponentStyles<HeadingClassNameContract, DesignSystem> = {
    heading: {
        "&$heading__1, &$heading__2, &$heading__3, &$heading__4, &$heading__5, &$heading__6, &$heading__7": {
            ...applyFontWeightSemiBold(),
        },
    },
    heading__1: {},
    heading__2: {},
    heading__3: {},
    heading__4: {},
    heading__5: {},
    heading__6: {},
    heading__7: {},
};

export default styles;
