import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { AutoSuggestClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { add, format, multiply, toPx } from "@microsoft/fast-jss-utilities";
import { DesignSystem } from "../design-system";
import { applyElevatedCornerRadius } from "../utilities/border";
import { neutralFillStealthRest } from "../utilities/color";
import { heightNumber } from "../utilities/density";
import { applyElevation, ElevationMultiplier } from "../utilities/elevation";
import { designUnit, outlineWidth } from "../utilities/design-system";
import { HighContrastColor, highContrastSelector } from "../utilities/high-contrast";

const visibleChildCount: number = 10;
const styles: ComponentStyles<AutoSuggestClassNameContract, DesignSystem> = {
    autoSuggest: {
        "min-width": "276px",
        "max-width": "374px",
    },
    autoSuggest_menu: {
        ...applyElevation(ElevationMultiplier.e11),
        background: neutralFillStealthRest,
        "z-index": "1",
        position: "absolute",
        width: "100%",
        margin: "0",
        padding: format("{0} 0", toPx(designUnit)),
        "margin-top": toPx(designUnit),
        "max-width": "374px",
        "min-width": "276px",
        "max-height": toPx(add(heightNumber(visibleChildCount), multiply(designUnit, 2))),
        overflow: "auto",
        ...applyElevatedCornerRadius(),
        [highContrastSelector]: {
            background: HighContrastColor.buttonBackground,
            border: format<DesignSystem>(
                "{0} solid {1}",
                toPx(outlineWidth),
                () => HighContrastColor.buttonText
            ),
        },
    },
    autoSuggest__menuOpen: {},
};

export default styles;
