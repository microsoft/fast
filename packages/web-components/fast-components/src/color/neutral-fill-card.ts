import { FASTDesignSystem } from "../fast-design-system.js";
import {
    backgroundColor,
    neutralFillCardDelta,
    neutralPalette,
} from "../fast-design-system.js";
import { Swatch, SwatchResolver } from "./common.js";
import { findClosestSwatchIndex, getSwatch } from "./palette.js";

const neutralCardFillAlgorithm: SwatchResolver = (
    designSystem: FASTDesignSystem
): Swatch => {
    const offset: number = neutralFillCardDelta(designSystem);
    const index: number = findClosestSwatchIndex(
        neutralPalette,
        backgroundColor(designSystem)
    )(designSystem);
    return getSwatch(
        index - (index < offset ? offset * -1 : offset),
        neutralPalette(designSystem)
    );
};

export function neutralFillCard(designSystem: FASTDesignSystem): Swatch;
export function neutralFillCard(backgroundResolver: SwatchResolver): SwatchResolver;
export function neutralFillCard(arg: any): any {
    if (typeof arg === "function") {
        return (designSystem: FASTDesignSystem): Swatch => {
            return neutralCardFillAlgorithm(
                Object.assign({}, designSystem, { backgroundColor: arg(designSystem) })
            );
        };
    } else {
        return neutralCardFillAlgorithm(arg);
    }
}
