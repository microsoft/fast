import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { SelectOptionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { density } from "../utilities/density";
import {
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFillStealthSelected,
    neutralFocus,
    neutralForegroundRest,
} from "../utilities/color";
// import {
//     disabledContrast,
//     ensureForegroundNormal,
//     ensureNormalContrast,
//     hoverContrast,
// } from "../utilities/colors";
import { applyFocusVisible } from "@microsoft/fast-jss-utilities";
import { applyTypeRampConfig } from "../utilities/typography";
// import typographyPattern from "../patterns/typography";
import {
    applyLocalizedProperty,
    contrast,
    Direction,
    ellipsis,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { curry } from "lodash-es";

const styles: ComponentStyles<SelectOptionClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<SelectOptionClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    return {
        selectOption: {
            listStyleType: "none",
            height: density(32),
            display: "grid",
            gridTemplateColumns: `${applyLocalizedProperty(
                "12px auto auto 1fr 12px",
                "12px 1fr auto auto 12px",
                direction
            )}`,
            gridTemplateRows: "auto",
            alignItems: "center",
            padding: "0",
            mneutralForegroundRestargin: "0 4px",
            color: neutralForegroundRest,
            whiteSpace: "nowrap",
            overflow: "hidden",
            cursor: "default",
            ...applyTypeRampConfig("t7"),
            background: neutralFillStealthRest,
            borderRadius: toPx(designSystem.cornerRadius),
            border: "2px solid transparent",
            ...applyFocusVisible<DesignSystem>({
                borderColor: neutralFocus,
            }),
            "&:hover": {
                background: neutralFillStealthHover,
            },
        },
        selectOption_contentRegion: {
            gridColumnStart: "3",
            overflow: "hidden",
            ...ellipsis(),
        },
        selectOption_glyph: {
            gridColumnStart: `${applyLocalizedProperty("2", "4", direction)}`,
            display: "inline-block",
            position: "relative",
            maxWidth: "16px",
            margin: `${applyLocalizedProperty("0 12px 0 0", "0 0 0 12px", direction)}`,
        },
        selectOption__disabled: {
            cursor: "not-allowed",
            opacity: ".3",
            "&, &:hover": {
                background: neutralFillStealthRest,
            },
        },
        selectOption__selected: {
            background: neutralFillStealthSelected,
            "&:hover": {
                background: neutralFillStealthSelected,
            },
        },
    };
};

export default styles;
