import { elements, html, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
import type { RadioGroup } from "./radio-group";

/**
 * The template for the {@link @microsoft/fast-foundation#RadioGroup} component.
 * @public
 */
export const radioGroupTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<RadioGroup> = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => html`
    <template
        role="radiogroup"
        aria-disabled="${x => x.disabled}"
        aria-readonly="${x => x.readOnly}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
        @focusout="${(x, c) => x.focusOutHandler(c.event as FocusEvent)}"
    >
        <slot name="label"></slot>
        <div
            class="positioning-region ${x =>
                x.orientation === Orientation.horizontal ? "horizontal" : "vertical"}"
            part="positioning-region"
        >
            <slot
                ${slotted({
                    property: "slottedRadioButtons",
                    filter: elements("[role=radio]"),
                })}
            ></slot>
        </div>
    </template>
`;
