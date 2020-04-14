import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { SubheadingClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { DesignSystem } from "../design-system";
import { applyFontWeightNormal } from "../utilities/fonts";
import { applyCursorDefault } from "../utilities/cursor";

const styles: ComponentStyles<SubheadingClassNameContract, DesignSystem> = {
    subheading: {
        "&$subheading__1, &$subheading__2, &$subheading__3, &$subheading__4, &$subheading__5, &$subheading__6, &$subheading__7": {
            ...applyCursorDefault(),
            ...applyFontWeightNormal(),
        },
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
