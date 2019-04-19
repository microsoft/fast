import { Swatch, SwatchResolver } from "./common";
import { DesignSystem } from "../../design-system";
import { findClosestSwatchIndex, getSwatch, PaletteType } from "./palette";
import { backgroundColor, neutralPalette } from "../design-system";

const neutralCardFillAlgorithm: SwatchResolver = (designSystem: DesignSystem): Swatch => {
    return getSwatch(
        findClosestSwatchIndex(PaletteType.neutral, backgroundColor(designSystem))(
            designSystem
        ) - 2,
        neutralPalette(designSystem)
    );
};

export function neutralFillCardRest(designSystem: DesignSystem): Swatch;
export function neutralFillCardRest(backgroundResolver: SwatchResolver): SwatchResolver;
export function neutralFillCardRest(arg: any): any {
    if (typeof arg === "function") {
        return (designSystem: DesignSystem): Swatch => {
            return neutralCardFillAlgorithm(
                Object.assign({}, designSystem, { backgroundColor: arg(designSystem) })
            );
        };
    } else {
        return neutralCardFillAlgorithm(arg);
    }
}
