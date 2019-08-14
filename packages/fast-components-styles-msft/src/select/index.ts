import DesignSystemDefaults, {
    DesignSystem,
} from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import {
    directionSwitch,
    ellipsis,
    format,
    localizeSpacing,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { SelectClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { glyphSize, height, horizontalSpacing } from "../utilities/density";
import { applyElevation, ElevationMultiplier } from "../utilities/elevation";
import {
    neutralFillStealthRest,
    neutralForegroundRest,
    neutralOutlineRest,
} from "../utilities/color";
import { applyElevatedCornerRadius } from "../utilities/border";
import { designUnit } from "../utilities/design-system";
import { inputFieldStyles } from "../patterns/input-field";
import { applyCursorPointer } from "../utilities/cursor";

const styles: ComponentStyles<SelectClassNameContract, DesignSystem> = {
    select: {
        maxWidth: "374px",
        height: height(),
    },
    select_button: {
        ...applyCursorPointer(),
        height: height(),
        width: "100%",
        ...inputFieldStyles(),
    },
    select_buttonContentRegion: {
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        justifyItems: "start",
    },
    select_buttonDisplayText: {
        ...ellipsis(),
        textAlign: directionSwitch("left", "right"),
        width: "100%",
    },
    select_toggleGlyph: {
        margin: (designSystem: DesignSystem): string => {
            return localizeSpacing(
                (designSystem && designSystem.direction) || DesignSystemDefaults.direction
            )(format("0 0 0 {0}", horizontalSpacing())(designSystem));
        },
        fill: neutralForegroundRest,
        width: glyphSize,
        height: glyphSize,
        gridColumnStart: "2",
    },
    select_menu: {
        background: neutralFillStealthRest,
        ...applyElevatedCornerRadius(),
        ...applyElevation(ElevationMultiplier.e11),
        position: "relative",
        width: "100%",
        margin: "0",
        padding: format("{0} 0", toPx<DesignSystem>(designUnit)),
        maxHeight: "328px",
        overflow: "auto",
    },
    select__multiSelectable: {
        "& $select_menu": {
            position: "static",
            boxShadow: "none",
            border: "1px solid",
            borderColor: neutralOutlineRest,
        },
    },
};

export default styles;
