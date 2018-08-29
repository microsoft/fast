import { IDesignSystem } from "../design-system";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { ISubheadingClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft"


function applySubheadingStyles(): ICSSRules<IDesignSystem> {
    return {
        fontWeight: "500"
    };
}

const styles: ComponentStyles<ISubheadingClassNameContract, IDesignSystem> = {

    subheading_1: {
        ...applySubheadingStyles()
    },
    subheading_2: {
        ...applySubheadingStyles()
    },
    subheading_3: {
        ...applySubheadingStyles()
    },
    subheading_4: {
        ...applySubheadingStyles()
    },
    subheading_5: {
        ...applySubheadingStyles()
    },
    subheading_6: {
        ...applySubheadingStyles()
    }
};

export default styles;