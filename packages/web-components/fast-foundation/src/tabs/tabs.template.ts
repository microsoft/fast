import { ElementViewTemplate, html, ref, slotted, when } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/index.js";
import type { FASTTabs, TabsOptions } from "./tabs.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTTabs:class)} component.
 * @public
 */
export function tabsTemplate<T extends FASTTabs>(
    options: TabsOptions = {}
): ElementViewTemplate<T> {
    return html<T>`
        ${startSlotTemplate(options)}
        <div class="tablist" part="tablist" role="tablist">
            <slot name="tab" ${slotted("tabs")}></slot>
            ${when(
                x => x.showActiveIndicator,
                html<T>`
                    <div
                        ${ref("activeIndicator")}
                        class="active-indicator"
                        part="active-indicator"
                    ></div>
                `
            )}
        </div>
        ${endSlotTemplate(options)}
        <div class="tabpanel" part="tabpanel">
            <slot name="tabpanel" ${slotted("tabpanels")}></slot>
        </div>
    `;
}
