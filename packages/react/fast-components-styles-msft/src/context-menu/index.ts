import { ContextMenuClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { format, toPx } from "@microsoft/fast-jss-utilities";
import { DesignSystem } from "../design-system";
import { applyElevatedCornerRadius } from "../utilities/border";
import { designUnit, outlineWidth } from "../utilities/design-system";
import { applyElevation, ElevationMultiplier } from "../utilities/elevation";
import {
    HighContrastColor,
    highContrastOptOutProperty,
    highContrastSelector,
} from "../utilities/high-contrast";
import { neutralLayerFloating } from "../utilities/color";

const styles: ComponentStyles<ContextMenuClassNameContract, DesignSystem> = {
    contextMenu: {
        background: neutralLayerFloating,
        ...applyElevatedCornerRadius(),
        ...applyElevation(ElevationMultiplier.e11),
        margin: "0",
        padding: format("{0} 0", toPx<DesignSystem>(designUnit)),
        "max-width": "368px",
        "min-width": "64px",
        transition: "all 0.2s ease-in-out",
        [highContrastSelector]: {
            ...highContrastOptOutProperty,
            background: HighContrastColor.buttonBackground,
            border: format(
                "{0} solid {1}",
                toPx<DesignSystem>(outlineWidth),
                () => HighContrastColor.buttonText
            ),
        },
    },
};

export default styles;
