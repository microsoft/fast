import { isDarkMode } from "./palette";
import { neutralForegroundDark, neutralForegroundLight } from "./neutral-foreground";
import { ColorRecipe, colorRecipeFactory, Swatch, SwatchResolver } from "./common";
import { DesignSystem } from "../../design-system";

export const neutralFocus: ColorRecipe<Swatch> = colorRecipeFactory(
    (designSystem: DesignSystem): Swatch => {
        return isDarkMode(designSystem)
            ? neutralForegroundLight(designSystem)
            : neutralForegroundDark(designSystem);
    }
);
