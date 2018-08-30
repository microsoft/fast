import { IDesignSystem } from "../design-system";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { ISubheadingClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft"
import { fontWeight } from "../utilities/fonts";

const styles: ComponentStyles<ISubheadingClassNameContract, IDesignSystem> = {
    subheading_1: {
        fontWeight: `${fontWeight.normal}`
    },
    subheading_2: {
        fontWeight: `${fontWeight.normal}`
    },
    subheading_3: {
        fontWeight: `${fontWeight.normal}`
    },
    subheading_4: {
        fontWeight: `${fontWeight.normal}`
    },
    subheading_5: {
        fontWeight: `${fontWeight.normal}`
    },
    subheading_6: {
        fontWeight: `${fontWeight.normal}`
    }
};

export default styles;
