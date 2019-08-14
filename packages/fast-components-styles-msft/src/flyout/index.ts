import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { FlyoutClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { DesignSystem } from "../design-system";
import { applyFloatingCornerRadius } from "../utilities/border";
import { applyElevation, ElevationMultiplier } from "../utilities/elevation";
import { backgroundColor } from "../utilities/design-system"

const styles: ComponentStyles<FlyoutClassNameContract, DesignSystem> = {
    flyout: {
        display: "none",
        background: backgroundColor,
        ...applyFloatingCornerRadius(),
        ...applyElevation(ElevationMultiplier.e14),
        zIndex: "1",
        '&[aria-hidden="false"]': {
            display: "block",
        },
    },
    flyout__top: {},
    flyout__bottom: {},
    flyout__left: {},
    flyout__right: {},
    flyout__horizontalInset: {},
    flyout__verticalInset: {},
};

export default styles;
