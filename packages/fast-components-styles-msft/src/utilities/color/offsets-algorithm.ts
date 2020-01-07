import {
    checkDesignSystemResolver,
    DesignSystem,
    DesignSystemResolver,
} from "../../design-system";
import { SwatchFamily, SwatchFamilyResolver } from "./common";
import { findClosestBackgroundIndex, getSwatch, isDarkMode, Palette } from "./palette";

/**
 * Function to derive colors from offset configuration.
 */
export function offsetsAlgorithm(
    palette: Palette | DesignSystemResolver<Palette>,
    restDelta: number | DesignSystemResolver<number>,
    hoverDelta: number | DesignSystemResolver<number>,
    activeDelta: number | DesignSystemResolver<number>,
    focusDelta: number | DesignSystemResolver<number>
): SwatchFamilyResolver {
    return (designSystem: DesignSystem): SwatchFamily => {
        const resolvedPalette: Palette = checkDesignSystemResolver(palette, designSystem);

        const backgroundIndex: number = findClosestBackgroundIndex(designSystem);

        const direction: 1 | -1 = isDarkMode(designSystem) ? -1 : 1;

        const resolvedRestDelta: number = checkDesignSystemResolver(
            restDelta,
            designSystem
        );
        const resolvedHoverDelta: number = checkDesignSystemResolver(
            hoverDelta,
            designSystem
        );
        const resolvedActiveDelta: number = checkDesignSystemResolver(
            activeDelta,
            designSystem
        );
        const resolvedFocusDelta: number = checkDesignSystemResolver(
            focusDelta,
            designSystem
        );

        return {
            rest: getSwatch(
                backgroundIndex + direction * resolvedRestDelta,
                resolvedPalette
            ),
            hover: getSwatch(
                backgroundIndex + direction * resolvedHoverDelta,
                resolvedPalette
            ),
            active: getSwatch(
                backgroundIndex + direction * resolvedActiveDelta,
                resolvedPalette
            ),
            focus: getSwatch(
                backgroundIndex + direction * resolvedFocusDelta,
                resolvedPalette
            ),
        };
    };
}
