import { elements, html, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import { endSlotTemplate, startSlotTemplate } from "../patterns/start-end.js";
import type { Toolbar, ToolbarOptions } from "./toolbar.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(Toolbar:class)} component.
 *
 * @public
 */
export const toolbarTemplate: FoundationElementTemplate<
    ViewTemplate<Toolbar>,
    ToolbarOptions
> = (context, definition) => html`
    <template
        aria-label="${x => x.ariaLabel}"
        aria-labelledby="${x => x.ariaLabelledby}"
        aria-orientation="${x => x.orientation}"
        orientation="${x => x.orientation}"
        role="toolbar"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        @focusin="${(x, c) => x.focusinHandler(c.event as FocusEvent)}"
        @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
    >
        <slot name="label"></slot>
        <div class="positioning-region" part="positioning-region">
            ${startSlotTemplate(context, definition)}
            <slot
                ${slotted({
                    filter: elements(),
                    property: "slottedItems",
                })}
            ></slot>
            ${endSlotTemplate(context, definition)}
        </div>
    </template>
`;
