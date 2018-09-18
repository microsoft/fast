import { IDesignSystem } from "../design-system";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { ISubheadingClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { fontWeight } from "../utilities/fonts";

const styles: ComponentStyles<ISubheadingClassNameContract, IDesignSystem> = {
    subheading: {
        fontWeight: `${fontWeight.normal}`
    },
    subheading__1: {},
    subheading__2: {},
    subheading__3: {},
    subheading__4: {},
    subheading__5: {},
    subheading__6: {}
};

export default styles;
