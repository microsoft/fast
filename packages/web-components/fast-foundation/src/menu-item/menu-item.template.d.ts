import type { ViewTemplate } from "@microsoft/fast-element";
import type { MenuItem, MenuItemOptions } from "./menu-item";
import type { ElementDefinitionContext } from "../design-system";
/**
 * Generates a template for the {@link @microsoft/fast-foundation#(MenuItem:class)} component using
 * the provided prefix.
 *
 * @public
 */
export declare const menuItemTemplate: (
    context: ElementDefinitionContext,
    definition: MenuItemOptions
) => ViewTemplate<MenuItem>;
