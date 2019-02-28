import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { AutoSuggestOptionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { density } from "../utilities/density";
import {
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFillStealthSelected,
    neutralFocus,
    neutralForegroundRest,
} from "../utilities/color";
import { applyFocusVisible } from "@microsoft/fast-jss-utilities";
import { applyTypeRampConfig } from "../utilities/typography";
import {
    applyLocalizedProperty,
    Direction,
    ellipsis,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { curry } from "lodash-es";

const styles: ComponentStyles<AutoSuggestOptionClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<AutoSuggestOptionClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    return {
        autoSuggestOption: {
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
            margin: "0 4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            cursor: "default",
            color: neutralForegroundRest,
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
        autoSuggestOption_contentRegion: {
            gridColumnStart: "3",
            overflow: "hidden",
            ...ellipsis(),
        },
        autoSuggestOption__disabled: {
            cursor: "not-allowed",
            opacity: ".3",
            "&:hover": {
                background: neutralFillStealthRest,
            },
        },
        autoSuggestOption__selected: {
            background: neutralFillStealthSelected,
            "&:hover": {
                background: neutralFillStealthSelected,
            },
        },
    };
};

export default styles;
