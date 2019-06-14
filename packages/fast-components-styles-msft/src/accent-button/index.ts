import { ButtonBaseClassNameContract as AccentButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import {
    applyFocusVisible,
    directionSwitch,
    format,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { DesignSystem, DesignSystemResolver } from "../design-system";
import { buttonStyles } from "../patterns/button";
import {
    accentFillActive,
    accentFillHover,
    accentFillRest,
    accentForegroundCut,
    neutralFocus,
} from "../utilities/color";
import { isDarkMode, Palette, swatchByContrast } from "../utilities/color/palette";
import { glyphSize } from "../utilities/density";
import { accentPalette, focusOutlineWidth } from "../utilities/design-system";
import { applyDisabledState } from "../utilities/disabled";

const accentButtonInnerFocusRect: DesignSystemResolver<string> = swatchByContrast(
    neutralFocus
)(accentPalette)(
    (
        referenceColor: string,
        sourcePalette: Palette,
        designSystem: DesignSystem
    ): number => {
        return sourcePalette.indexOf(accentFillRest(designSystem));
    }
)(
    (referenceIndex: number, palette: string[], designSystem: DesignSystem): 1 | -1 => {
        return isDarkMode({
            ...designSystem,
            backgroundColor: neutralFocus(designSystem),
        })
            ? -1
            : 1;
    }
)((contrastRatio: number): boolean => contrastRatio >= 4.5);

const styles: ComponentStyles<AccentButtonClassNameContract, DesignSystem> = {
    button: {
        ...buttonStyles(),
        color: accentForegroundCut,
        fill: accentForegroundCut,
        background: accentFillRest,
        "&:hover:enabled": {
            background: accentFillHover,
        },
        "&:active:enabled": {
            background: accentFillActive,
        },
        ...applyFocusVisible<DesignSystem>({
            borderColor: neutralFocus,
            boxShadow: format("0 0 0 2px inset {0}", accentButtonInnerFocusRect),
        }),
        "& $button_beforeContent, & $button_afterContent": {
            fill: accentForegroundCut,
        },
    },
    button_contentRegion: {
        position: "relative",
        "&::before": {
            content: "''",
            display: "block",
            height: toPx<DesignSystem>(focusOutlineWidth),
            position: "absolute",
            bottom: "-3px",
            width: "100%",
            left: directionSwitch("0", ""),
            right: directionSwitch("", "0"),
        },
        "& svg": {
            width: glyphSize,
            height: glyphSize,
        },
    },
    button__disabled: {
        ...applyDisabledState(),
    },
    button_beforeContent: {
        width: glyphSize,
        height: glyphSize,
    },
    button_afterContent: {
        width: glyphSize,
        height: glyphSize,
    },
};

export default styles;
