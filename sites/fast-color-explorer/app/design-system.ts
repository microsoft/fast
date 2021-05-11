import {
    FASTDesignSystem,
    fastDesignSystemDefaults,
    Palette,
} from "@microsoft/fast-components";
import { createColorPalette } from "@microsoft/fast-components";
import { ColorRGBA64, parseColorHexRGB } from "@microsoft/fast-colors";
import { StandardLuminance } from "@microsoft/fast-components";
import { DesignSystemResolver } from "@microsoft/fast-components/dist/esm/fast-design-system";
import { defaultAccentColor, defaultNeutralColor } from "./colors";

const neutralPalette: Palette = createColorPalette(
    parseColorHexRGB(defaultNeutralColor) as ColorRGBA64
);

/**
 * Bridge recipes between React and web component implementations.
 *
 * @param recipe
 * @returns
 */
export const bridge = (recipe: DesignSystemResolver<string>): any => {
    return (d?: FASTDesignSystem): any => recipe(d || fastDesignSystemDefaults);
};

export type ColorsDesignSystem = FASTDesignSystem & {
    // Bring these back from the old DesignSystem for use with React components
    contrast: number;
    neutralForegroundDarkIndex: number;
    neutralForegroundLightIndex: number;
};

export const colorsDesignSystem: ColorsDesignSystem = Object.assign(
    {},
    fastDesignSystemDefaults,
    {
        // These three are only for legacy React component support
        contrast: 0,
        neutralForegroundDarkIndex: 0,
        neutralForegroundLightIndex: 0,

        baseHeightMultiplier: 8,
        baseLayerLuminance: StandardLuminance.DarkMode,
        neutralPalette,
        accentPalette: createColorPalette(
            parseColorHexRGB(defaultAccentColor) as ColorRGBA64
        ),
        accentBaseColor: defaultAccentColor,
    }
);
