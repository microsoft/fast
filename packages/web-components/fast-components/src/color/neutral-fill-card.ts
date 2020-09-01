import { FASTDesignSystem } from "../fast-design-system";
import {
    backgroundColor,
    neutralFillCardDelta,
    neutralPalette,
} from "../fast-design-system";
import { Swatch, SwatchResolver } from "./common";
import { findClosestSwatchIndex, getSwatch } from "./palette";

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
/**
 * @internal
 */
export function neutralFillCard(designSystem: FASTDesignSystem): Swatch;
/**
 * @internal
 */
export function neutralFillCard(backgroundResolver: SwatchResolver): SwatchResolver;
/**
 * @internal
 */
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
