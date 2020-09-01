import {
    createColorPalette,
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";
import { ColorRGBA64, parseColor } from "@microsoft/fast-colors";

const accent: string = "#FB356D";
const accentPaletteSource: ColorRGBA64 | null = parseColor(accent);
const palette: string[] = createColorPalette(accentPaletteSource as ColorRGBA64);
const creatorDesignSystem: DesignSystem = Object.assign({}, DesignSystemDefaults, {
    density: -2,
    accentBaseColor: accent,
    accentPalette: palette,
    backgroundColor:
        DesignSystemDefaults.neutralPalette[
            DesignSystemDefaults.neutralPalette.length - 1
        ],
});

export { creatorDesignSystem };
