import { CSSRules } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";

function applyCursor(value: string): CSSRules<DesignSystem> {
    return { cursor: value };
}

export function applyCursorDefault(): CSSRules<DesignSystem> {
    return applyCursor("default");
}

export function applyCursorDisabled(): CSSRules<DesignSystem> {
    return applyCursor("not-allowed !important");
}

export function applyCursorPointer(): CSSRules<DesignSystem> {
    return applyCursor("pointer");
}
