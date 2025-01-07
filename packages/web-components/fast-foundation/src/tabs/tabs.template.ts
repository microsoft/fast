import { html, ref, slotted, when } from "@ni/fast-element";
import type { ViewTemplate } from "@ni/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/start-end.js";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { Tabs, TabsOptions } from "./tabs.js";

/**
 * The template for the {@link @ni/fast-foundation#(Tabs:class)} component.
 * @public
 */
export const tabsTemplate: FoundationElementTemplate<ViewTemplate<Tabs>, TabsOptions> = (
    context,
    definition
) => html`
    <template class="${x => x.orientation}">
        ${startSlotTemplate(context, definition)}
        <div class="tablist" part="tablist" role="tablist">
            <slot class="tab" name="tab" part="tab" ${slotted("tabs")}></slot>

            ${when(
                x => x.showActiveIndicator,
                html<Tabs>`
                    <div
                        ${ref("activeIndicatorRef")}
                        class="activeIndicator"
                        part="activeIndicator"
                    ></div>
                `
            )}
        </div>
        ${endSlotTemplate(context, definition)}
        <div class="tabpanel" part="tabpanel">
            <slot name="tabpanel" ${slotted("tabpanels")}></slot>
        </div>
    </template>
`;
