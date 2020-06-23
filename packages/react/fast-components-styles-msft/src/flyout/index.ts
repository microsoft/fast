import { FlyoutClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";
import { applyFloatingCornerRadius } from "../utilities/border";
import { backgroundColor } from "../utilities/design-system";
import { applyElevation, ElevationMultiplier } from "../utilities/elevation";
import { highContrastBorder } from "../utilities/high-contrast";

const styles: ComponentStyles<FlyoutClassNameContract, DesignSystem> = {
    flyout: {
        background: backgroundColor,
        ...applyFloatingCornerRadius(),
        ...applyElevation(ElevationMultiplier.e14),
        "z-index": "1",
        ...highContrastBorder,
    },
    flyout__top: {},
    flyout__bottom: {},
    flyout__left: {},
    flyout__right: {},
    flyout__horizontalInset: {},
    flyout__verticalInset: {},
};

export default styles;
