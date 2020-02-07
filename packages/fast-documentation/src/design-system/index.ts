import {
    createColorPalette,
    DesignSystem as DesignSystemBase,
    DesignSystemDefaults as MSFTDefaults
} from "@microsoft/fast-components-styles-msft";
import { withDefaults } from "@microsoft/fast-jss-utilities";
import { parseColorHexRGB } from "@microsoft/fast-colors";

/**
 * Inherit MSFT design system interface
 */
/* tslint:disable-next-line:no-empty-interface */
export interface DesignSystem extends DesignSystemBase {}

/**
 * Create defaults for all design system properties inherting from MSFT defaults
 */
/* tslint:disable-next-line:no-empty-interface */
export const designSystemDefaults: DesignSystem = Object.assign({}, MSFTDefaults, {
    backgroundColor: "#1B1B1B",
    accentPalette: createColorPalette(parseColorHexRGB("#DC2E5F")),
    accentBaseColor: "#DC2E5F"
});

/**
 * Ensure that all properties of the design system are assigned
 */
export const withDesignSystemDefaults: (config: Partial<DesignSystem>) => DesignSystem = (
    config: Partial<DesignSystem>
): DesignSystem => withDefaults(designSystemDefaults)(config);
