import { ElementViewTemplate, html, ref } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/index.js";
import type { DisclosureOptions, FASTDisclosure } from "./disclosure.js";

/**
 * The template for the {@link @microsoft/fast-foundation#FASTDisclosure} component.
 * @public
 */
export function disclosureTemplate<T extends FASTDisclosure>(
    options: DisclosureOptions = {}
): ElementViewTemplate<T> {
    return html<T>`
        <details class="details" part="details" ${ref("details")}>
            <summary
                class="summary"
                role="button"
                part="summary"
                aria-controls="content"
                aria-expanded="${x => x.expanded}"
            >
                ${startSlotTemplate(options)}
                <slot name="summary">${x => x.summary}</slot>
                ${endSlotTemplate(options)}
            </summary>
            <div id="content" part="content"><slot></slot></div>
        </details>
    `;
}
