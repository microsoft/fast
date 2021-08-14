import { html, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
import type { Menu } from "./menu";

/**
 * The template for the {@link @microsoft/fast-foundation#Menu} component.
 * @public
 */
export const menuTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<Menu> = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => html`
    <template
        slot="${x => (x.slot ? x.slot : x.isNestedMenu() ? "submenu" : void 0)}"
        role="menu"
        @keydown="${(x, c) => x.handleMenuKeyDown(c.event as KeyboardEvent)}"
        @focusout="${(x, c) => x.handleFocusOut(c.event as FocusEvent)}"
    >
        <slot ${slotted("items")}></slot>
    </template>
`;
