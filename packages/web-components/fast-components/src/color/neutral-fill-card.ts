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
 * @deprecated - to-be deleted
 */
export function neutralFillCard_DEPRECATED(designSystem: FASTDesignSystem): Swatch;
/**
 * @internal
 * @deprecated - to-be deleted
 */
export function neutralFillCard_DEPRECATED(
    backgroundResolver: SwatchResolver
): SwatchResolver;
/**
 * @internal
 * @deprecated - to-be deleted
 */
export function neutralFillCard_DEPRECATED(arg: any): any {
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
