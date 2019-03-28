import { CSSRules } from "@microsoft/fast-jss-manager";
import { DesignSystem, withDesignSystemDefaults } from "../design-system";

export function applyCursorDefault(): CSSRules<DesignSystem> {
    return {
        cursor: "default",
    };
}

export function applyCursorDisabled(): CSSRules<DesignSystem> {
    return {
        cursor: "not-allowed !important",
    };
}

export function applyCursorPointer(): CSSRules<DesignSystem> {
    return {
        cursor: "pointer",
    };
}
