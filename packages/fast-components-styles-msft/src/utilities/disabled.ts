import { CSSRules } from "@microsoft/fast-jss-manager";
import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { applyCursorDisabled } from "./cursor";

export function applyDisabledState(config: DesignSystem): CSSRules<DesignSystem> {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    return {
        opacity: `${designSystem.disabledOpacity}`,
        ...applyCursorDisabled(),
    };
}
