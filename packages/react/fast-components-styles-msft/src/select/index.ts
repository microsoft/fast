import { ComponentStyles } from "@microsoft/fast-jss-manager";
import {
    directionSwitch,
    ellipsis,
    format,
    localizeSpacing,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { SelectClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    neutralForegroundRest,
    neutralLayerFloating,
    neutralOutlineRest,
} from "../utilities/color";
import { glyphSize, height, horizontalSpacing } from "../utilities/density";
import { applyElevation, ElevationMultiplier } from "../utilities/elevation";
import DesignSystemDefaults, { DesignSystem } from "../design-system";
import { applyElevatedCornerRadius } from "../utilities/border";
import { designUnit, outlineWidth } from "../utilities/design-system";
import { inputFieldStyles } from "../patterns/input-field";
import { applyCursorPointer } from "../utilities/cursor";
import {
    HighContrastColor,
    highContrastDisabledForeground,
    highContrastForeground,
    highContrastOptOutProperty,
    highContrastOutline,
    highContrastSelector,
} from "../utilities/high-contrast";

const styles: ComponentStyles<SelectClassNameContract, DesignSystem> = {
    select: {
        "max-width": "374px",
        height: height(),
    },
    select_button: {
        ...applyCursorPointer(),
        height: height(),
        width: "100%",
        ...inputFieldStyles(),
        ...highContrastOutline,
        "&:disabled > span > svg": {
            ...highContrastDisabledForeground,
        },
    },
    select_buttonContentRegion: {
        display: "grid",
        "grid-template-columns": "1fr auto",
        "align-items": "center",
        "justify-items": "start",
    },
    select_buttonDisplayText: {
        ...ellipsis(),
        "text-align": directionSwitch("left", "right"),
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
        "grid-column-start": "2",
        ...highContrastForeground,
    },
    select_menu: {
        background: neutralLayerFloating,
        ...applyElevatedCornerRadius(),
        ...applyElevation(ElevationMultiplier.e11),
        position: "relative",
        width: "100%",
        margin: "0",
        padding: format("{0} 0", toPx<DesignSystem>(designUnit)),
        "max-height": "328px",
        overflow: "auto",
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
    select__multiSelectable: {
        "& $select_menu": {
            position: "static",
            "box-shadow": "none",
            border: "1px solid",
            "border-color": neutralOutlineRest,
        },
    },
    select__menuPositioningRegion: {
        display: "grid",
        "grid-template-columns": "1fr",
        "grid-template-rows": "1fr",
    },
    select__menuPositionLeft: {
        "grid-template-columns": "1fr auto",
        "& $select_menu": {
            "grid-column": "2",
        },
    },
    select__menuPositionRight: {
        "grid-template-columns": "auto 1fr",
        "& $select_menu": {
            "grid-column": "1",
        },
    },
    select__menuPositionTop: {
        "grid-template-rows": "1fr auto",
        "& $select_menu": {
            "grid-row": "2",
        },
    },
    select__menuPositionBottom: {
        "grid-template-rows": "auto 1fr",
        "& $select_menu": {
            "grid-row": "1",
        },
    },
};

export default styles;
