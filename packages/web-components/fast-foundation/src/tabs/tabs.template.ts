import { ElementViewTemplate, html, ref, slotted, when } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/index.js";
import type { FASTTabs, TabsOptions } from "./tabs.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTTabs:class)} component.
 * @public
 */
export function tabsTemplate(options: TabsOptions = {}): ElementViewTemplate<FASTTabs> {
    return html<FASTTabs>`
        <template class="${x => x.orientation}">
            ${startSlotTemplate(options)}
            <div class="tablist" part="tablist" role="tablist">
                <slot name="tab" ${slotted("tabs")}></slot>

                ${when(
                    x => x.showActiveIndicator,
                    html<FASTTabs>`
                        <div
                            ${ref("activeIndicatorRef")}
                            class="active-indicator"
                            part="active-indicator"
                        ></div>
                    `
                )}
            </div>
            ${endSlotTemplate(options)}
            <div class="tabpanel">
                <slot name="tabpanel" ${slotted("tabpanels")}></slot>
            </div>
        </template>
    `;
}
