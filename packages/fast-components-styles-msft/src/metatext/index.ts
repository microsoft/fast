import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { MetatextClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { neutralForegroundHint } from "../utilities/color";
import { applyScaledTypeRamp } from "../utilities/typography";

const styles: ComponentStyles<MetatextClassNameContract, DesignSystem> = {
    metatext: {
        ...applyScaledTypeRamp("t7"),
        color: neutralForegroundHint,
    },
};

export default styles;
