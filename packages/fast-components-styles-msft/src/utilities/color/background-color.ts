import { DesignSystem, ensureDesignSystemDefaults } from "../../design-system";
import { Swatch, SwatchResolver } from "./common";

/**
 * Returns the current design-system background
 */
export const backgroundColor: SwatchResolver = ensureDesignSystemDefaults(
    (designSystem: DesignSystem): Swatch => designSystem.backgroundColor
);
