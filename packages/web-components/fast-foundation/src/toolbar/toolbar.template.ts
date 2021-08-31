import { elements, html, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { ElementDefinitionContext } from "../design-system";
import { endTemplate, startTemplate } from "../patterns";
import type { Toolbar, ToolbarOptions } from "./toolbar";

/**
 * The template for the {@link @microsoft/fast-foundation#(Toolbar:class)} component.
 *
 * @public
 */
export const toolbarTemplate: (
    context: ElementDefinitionContext,
    definition: ToolbarOptions
) => ViewTemplate<Toolbar> = (
    context: ElementDefinitionContext,
    definition: ToolbarOptions
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
            ${startTemplate(context, definition)}
            <slot
                ${slotted({
                    filter: elements(),
                    property: "slottedItems",
                })}
            ></slot>
            ${endTemplate(context, definition)}
        </div>
    </template>
`;
