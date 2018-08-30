import { IDesignSystem } from "../design-system";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { ISubheadingClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { fontWeight } from "../utilities/fonts";

const styles: ComponentStyles<ISubheadingClassNameContract, IDesignSystem> = {
    subheading: {
        fontWeight: `${fontWeight.normal}`
    },
    subheading_1: {},
    subheading_2: {},
    subheading_3: {},
    subheading_4: {},
    subheading_5: {},
    subheading_6: {}
};

export default styles;
