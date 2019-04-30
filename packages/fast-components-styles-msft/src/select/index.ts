import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import {
    applyLocalizedProperty,
    Direction,
    ellipsis,
    format,
    toPx,
} from "@microsoft/fast-jss-utilities";
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

const styles: ComponentStyles<SelectClassNameContract, DesignSystem> = {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;    

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
            ...ellipsis(),
            textAlign: applyLocalizedProperty("left", "right", direction),
            width: "100%",
        },

        select_toggleGlyph: {
            [applyLocalizedProperty(
                "margin-left",
                "margin-right",
                direction
            )]: horizontalSpacing(),
            fill: neutralForegroundRest,
            width: glyphSize,
            height: glyphSize,
            gridColumnStart: "2",
        },

        select__disabled: {},

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
