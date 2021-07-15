import { Direction } from "@microsoft/fast-web-utilities";
export interface DesignSystem {
    /**
     * The primary direction of the view.
     */
    direction: Direction;
}
/**
 * Ensure that all properties of the design system are assigned
 */
export declare const withDesignSystemDefaults: (
    config: Partial<DesignSystem>
) => DesignSystem;
