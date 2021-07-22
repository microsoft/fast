import { elements, html, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
import type { Toolbar } from "./toolbar";

/**
 * The template for the {@link @microsoft/fast-foundation#(Toolbar:class)} component.
 *
 * @public
 */
export const toolbarTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<Toolbar> = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => html`
    <template
        aria-label="${x => x.ariaLabel}"
        aria-labelledby="${x => x.ariaLabelledby}"
        aria-orientation="${x => x.orientation}"
        orientation="${x => x.orientation}"
        role="toolbar"
    >
        <slot name="label"></slot>
        <div class="positioning-region" part="positioning-region">
            ${startTemplate}
            <span
                class="content"
                part="content"
                @focusin="${(x, c) => x.focusinHandler(c.event as FocusEvent)}"
                @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
                @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
            >
                <slot
                    ${slotted({
                        filter: elements(),
                        property: "slottedItems",
                    })}
                ></slot>
            </span>
            ${endTemplate}
        </div>
    </template>
`;
