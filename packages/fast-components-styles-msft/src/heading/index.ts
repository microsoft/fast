import { IDesignSystem } from "../design-system";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IHeadingClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { applyBreakpoint, breakpoints } from "../utilities/breakpoints";

function applyHeadingStyles(): ICSSRules<IDesignSystem> {
    return {
        fontWeight: "700"
    };
}
/**
 * TODO #306: Pull font weight styles when we have an API for font/variable font properties
 */
const styles: ComponentStyles<IHeadingClassNameContract, IDesignSystem> = {
    heading_1: {
        ...applyHeadingStyles()
    },
    heading_2: {
        ...applyHeadingStyles()
    },
    heading_3: {
        ...applyHeadingStyles()
    },
    heading_4: {
        ...applyHeadingStyles()
    },
    heading_5: {
        ...applyHeadingStyles()
    },
    heading_6: {
        ...applyHeadingStyles()
    }
};

export default styles;
