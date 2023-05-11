import { ElementViewTemplate, html, ref } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/start-end.js";
import type { DisclosureOptions, FASTDisclosure } from "./disclosure.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTDisclosure:class)} component.
 * @public
 */
export function disclosureTemplate<T extends FASTDisclosure>(
    options: DisclosureOptions = {}
): ElementViewTemplate<T> {
    return html<T>`
        <details class="disclosure" ${ref("details")}>
            <summary
                class="invoker"
                role="button"
                aria-controls="disclosure-content"
                aria-expanded="${x => x.expanded}"
            >
                ${startSlotTemplate(options)}
                <slot name="summary">${x => x.summary}</slot>
                ${endSlotTemplate(options)}
            </summary>
            <div id="disclosure-content"><slot></slot></div>
        </details>
    `;
}
