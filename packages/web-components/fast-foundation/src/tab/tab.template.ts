import { ElementViewTemplate, html } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/index.js";
import type { StartEndOptions } from "../patterns/index.js";
import type { FASTTab } from "./tab.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTTab:class)} component.
 * @public
 */
export function tabTemplate<T extends FASTTab>(
    options: StartEndOptions = {}
): ElementViewTemplate<T> {
    return html<T>`
        <template slot="tab" role="tab" aria-disabled="${x => x.disabled}">
            ${startSlotTemplate(options)}
            <span class="content" part="content">
                <slot></slot>
            </span>
            ${endSlotTemplate(options)}
        </template>
    `;
}
