import {
    DesignSystem,
    DesignSystemResolver,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../design-system";
import { toPx } from "@microsoft/fast-jss-utilities";

/**
 * Retrieve the outlineWidth when invoked with a DesignSystem
 * When invoked with a multiplier, a function is returned that accepts the DesignSystem,
 * which returns the outlineWidth multiplied by the multiplier
 */
export function outlineWidth(designSystem: DesignSystem): number;
export function outlineWidth(multiplier: number): DesignSystemResolver<number>;
export function outlineWidth(arg: any): any {
    if (typeof arg === "number") {
        return ensureDesignSystemDefaults(
            (designSystem: DesignSystem): number => {
                return designSystem.outlineWidth * arg;
            }
        );
    }

    return withDesignSystemDefaults(arg).outlineWidth;
}

/**
 * Retrieve the designUnit when invoked with a DesignSystem
 * When invoked with a multiplier, a function is returned that accepts the DesignSystem,
 * which returns the designUnit multiplied by the multiplier
 */
export function designUnit(designSystem: DesignSystem): number;
export function designUnit(multiplier: number): DesignSystemResolver<number>;
export function designUnit(arg: any): any {
    if (typeof arg === "number") {
        return ensureDesignSystemDefaults(
            (designSystem: DesignSystem): number => {
                return designSystem.designUnit * arg;
            }
        );
    }

    return withDesignSystemDefaults(arg).designUnit;
}

/**
 * Retrieve the focusOutlineWidth when invoked with a DesignSystem
 * When invoked with a multiplier, a function is returned that accepts the DesignSystem,
 * which returns the focusOutlineWidth multiplied by the multiplier
 */
export function focusOutlineWidth(designSystem: DesignSystem): number;
export function focusOutlineWidth(multiplier: number): DesignSystemResolver<number>;
export function focusOutlineWidth(arg: any): any {
    if (typeof arg === "number") {
        return ensureDesignSystemDefaults(
            (designSystem: DesignSystem): number => {
                return designSystem.focusOutlineWidth * arg;
            }
        );
    }

    return withDesignSystemDefaults(arg).focusOutlineWidth;
}
