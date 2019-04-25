import {
    DesignSystem,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { applyLocalizedProperty, format, toPx } from "@microsoft/fast-jss-utilities";
import { SelectClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { glyphSize, height, horizontalSpacing } from "../utilities/density";
import { elevation, ElevationMultiplier } from "../utilities/elevation";
import {
    neutralFillStealthRest,
    neutralForegroundRest,
    neutralOutlineRest,
} from "../utilities/color";
import { applyFloatingCornerRadius } from "../utilities/border";
import { designUnit } from "../utilities/design-system";
import { inputFieldStyles } from "../patterns/input-field";
import { applyDisabledState } from "../utilities/disabled";
import { focusOutlineWidth } from "../utilities/design-system";

const styles: ComponentStyles<SelectClassNameContract, DesignSystem> = {
    select: {
        minWidth: "276px",
        maxWidth: "374px",
    },

        select_button: {
            height: height(),
            width: "100%",
            ...inputFieldStyles(),
        },

        select_button_contentRegion: {
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            justifyItems: "start",
        },

        select_button_displayText: {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textAlign: "left",
            width: "100%",
        },

        select_toggleGlyph: {
            margin: "0 0 0 10px",
            fill: neutralForegroundRest,
            width: glyphSize,
            height: glyphSize,
            gridColumnStart: "2",
        },

        select__disabled: {
            ...applyDisabledState(),
        },

        select_menu: {
            background: neutralFillStealthRest,
            ...applyFloatingCornerRadius(),
            ...applyElevation(ElevationMultiplier.e11),
            zIndex: "1",
            position: "absolute",
            width: "100%",
            margin: "0",
            padding: format("{0} 0", toPx<DesignSystem>(designUnit)),
            maxWidth: "374px",
            minWidth: "276px",
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
    select_menu__open: {},
};

export default styles;
