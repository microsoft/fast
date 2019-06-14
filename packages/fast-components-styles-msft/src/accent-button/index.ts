import { ButtonBaseClassNameContract as AccentButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { applyFocusVisible, format } from "@microsoft/fast-jss-utilities";
import { DesignSystem, DesignSystemResolver } from "../design-system";
import { baseButton, buttonStyles } from "../patterns/button";
import {
    accentFillActive,
    accentFillHover,
    accentFillRest,
    accentForegroundCut,
    neutralFocus,
} from "../utilities/color";
import { isDarkMode, Palette, swatchByContrast } from "../utilities/color/palette";
import { accentPalette } from "../utilities/design-system";

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
    ...baseButton,
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
};

export default styles;
