import { DesignSystem, DesignSystemResolver } from "../../design-system";
import { neutralDividerDelta } from "../design-system";
import {
    findClosestBackgroundIndex,
    getSwatch,
    palette,
    Palette,
    PaletteType,
} from "./palette";

export const neutralDivider: DesignSystemResolver<string> = (
    designSystem: DesignSystem
): string => {
    const neutralPalette: Palette = palette(PaletteType.neutral)(designSystem);
    const backgroundIndex: number = findClosestBackgroundIndex(designSystem);
    const delta: number = neutralDividerDelta(designSystem);
    const swapThreshold: number = neutralPalette.length - delta;
    const direction: 1 | -1 = backgroundIndex >= swapThreshold ? -1 : 1;

    const index: number = backgroundIndex + direction * delta;
    return getSwatch(index, neutralPalette);
};
