import defaultDesignSystem, {
    DesignSystem,
    ensureDesignSystemDefaults,
} from "../../design-system";
import { Swatch, SwatchResolver } from "./common";

/**
 * Returns the current design-system background
 */
export function backgroundColor(designSystem?: DesignSystem): string {
    return (
        (designSystem && designSystem.backgroundColor) ||
        defaultDesignSystem.backgroundColor
    );
}
