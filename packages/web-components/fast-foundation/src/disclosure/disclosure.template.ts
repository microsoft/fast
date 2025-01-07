import { html, ref } from "@ni/fast-element";
import type { ViewTemplate } from "@ni/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { Disclosure } from "./disclosure.js";

/**
 * The template for the {@link @ni/fast-foundation#Disclosure} component.
 * @public
 */
export const disclosureTemplate: FoundationElementTemplate<ViewTemplate<Disclosure>> = (
    context,
    definition
) => html`
    <details class="disclosure" ${ref("details")}>
        <summary
            class="invoker"
            role="button"
            aria-controls="disclosure-content"
            aria-expanded="${x => x.expanded}"
        >
            <slot name="start"></slot>
            <slot name="title">${x => x.title}</slot>
            <slot name="end"></slot>
        </summary>
        <div id="disclosure-content"><slot></slot></div>
    </details>
`;
