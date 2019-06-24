import { getSwatch, isDarkMode, Palette, palette, PaletteType } from "./palette";
import { ColorRecipe, colorRecipeFactory, Swatch } from "./common";
import { DesignSystem } from "../../design-system";

// These literal values are to remove the dependency on neutralForegroundLight and Dark,
// and are very temporary as focus is being updated to contrast-based as well.
export const neutralFocus: ColorRecipe<Swatch> = colorRecipeFactory(
    (designSystem: DesignSystem): Swatch => {
        const neutralPalette: Palette = palette(PaletteType.neutral)(designSystem);

        return isDarkMode(designSystem)
            ? getSwatch(0, neutralPalette)
            : getSwatch(neutralPalette.length - 5, neutralPalette);
    }
);
