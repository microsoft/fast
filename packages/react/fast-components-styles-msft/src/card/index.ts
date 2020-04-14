import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { CardClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { DesignSystem } from "../design-system";
import { applyElevatedCornerRadius } from "../utilities/border";
import { applyElevation, ElevationMultiplier } from "../utilities/elevation";
import { backgroundColor } from "../utilities/design-system";
import { highContrastBorder } from "../utilities/high-contrast";

const styles: ComponentStyles<CardClassNameContract, DesignSystem> = {
    card: {
        width: "100%",
        height: "100%",
        background: backgroundColor,
        ...applyElevatedCornerRadius(),
        ...applyElevation(ElevationMultiplier.e4),
        transition: "all 0.2s ease-in-out",
        ...highContrastBorder,
    },
};

export default styles;
