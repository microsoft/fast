import { ElementViewTemplate, html, ref } from "@microsoft/fast-element";
import type { FASTDisclosure } from "./disclosure.js";

/**
 * The template for the {@link @microsoft/fast-foundation#FASTDisclosure} component.
 * @public
 */
export function disclosureTemplate(): ElementViewTemplate<FASTDisclosure> {
    return html<FASTDisclosure>`
        <details class="disclosure" ${ref("details")}>
            <summary
                class="invoker"
                role="button"
                aria-controls="disclosure-content"
                aria-expanded="${x => x.expanded}"
            >
                <slot name="start"></slot>
                <slot name="summary">${x => x.summary}</slot>
                <slot name="end"></slot>
            </summary>
            <div id="disclosure-content"><slot></slot></div>
        </details>
    `;
}
