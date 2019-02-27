import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import {
    ButtonClassNameContract,
    SelectClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";
import { applyLocalizedProperty, Direction } from "@microsoft/fast-jss-utilities";
import { elevation, ElevationMultiplier } from "../utilities/elevation";
import { toPx } from "@microsoft/fast-jss-utilities";
import {
    applyMixedColor,
    ensureNormalContrast,
    hoverContrast,
    normalContrast,
} from "../utilities/colors";
import outlinePattern from "../patterns/outline";
import { isAbsolute } from "path";

export const selectDisplayButtonOverrides: ComponentStyles<
    Partial<ButtonClassNameContract>,
    DesignSystem
> = {
    button: {
        width: "100%",
    },
    button_contentRegion: {
        width: "100%",
        display: "inline-flex",
    },
};

const styles: ComponentStyles<SelectClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<SelectClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

    const backgroundColor: string = designSystem.backgroundColor;
    const direction: Direction = designSystem.direction;
    const foregroundColor: string = ensureNormalContrast(
        designSystem.contrast,
        designSystem.foregroundColor,
        designSystem.backgroundColor
    );

    const glyphColorHover: string = hoverContrast(config.contrast, foregroundColor);

    return {
        select: {
            minWidth: "276px",
        },

        select_toggleGlyph: {
            display: "inline-flex",
            position: "absolute",
            right: "0",
            width: "12px",
            height: "12px",
            "&::after": {
                boxSizing: "border-box",
                transform: "translateX(-3px) rotate(135deg)",
                height: "12px",
                width: "12px",
                content: '""',
                borderRight: `1px solid ${foregroundColor}`,
                borderTop: `1px solid ${foregroundColor}`,
            },
        },

        select__disabled: {},

        select_menu: {
            ...elevation(ElevationMultiplier.e11, designSystem.foregroundColor)(
                designSystem
            ),
            background: backgroundColor,
            zIndex: "1",
            position: "absolute",
            width: "100%",
            margin: "0",
            padding: "4px 0",
            maxWidth: "374px",
            minWidth: "276px",
            borderRadius: toPx(designSystem.cornerRadius * 2),
        },

        select__multiSelectable: {
            "& $select_menu": {
                position: "static",
                boxShadow: "none",
            },
        },

        select__menuOpen: {},

        select__menuDisabled: {},
    };
};

export default styles;
