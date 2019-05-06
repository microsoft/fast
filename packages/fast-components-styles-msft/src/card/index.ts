import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { CardClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyCornerRadius } from "../utilities/border";
import { applyElevation, ElevationMultiplier } from "../utilities/elevation";
import { backgroundColor } from "../utilities/design-system";

const styles: ComponentStyles<CardClassNameContract, DesignSystem> = {
    card: {
        width: "100%",
        height: "100%",
        background: backgroundColor,
        ...applyCornerRadius(),
        ...applyElevation(ElevationMultiplier.e4),
        transition: "all 0.2s ease-in-out",
    },
};

export default styles;
