import { elements, html, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns";
import type { Toolbar } from "./toolbar";

/**
 * The template for the {@link @microsoft/fast-foundation#(Toolbar:class)} component.
 *
 * @public
 */
export const toolbarTemplate: (context, definition) => ViewTemplate<Toolbar> = (
    context,
    definition
) => html`
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
            ${startTemplate}
            <slot
                ${slotted({
                    filter: elements(),
                    property: "slottedItems",
                })}
            ></slot>
            ${endTemplate}
        </div>
    </template>
`;
