import { html, ref, slotted, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/start-end";
import type { ElementDefinitionContext } from "../design-system";
import type { Tabs, TabsOptions } from "./tabs";

/**
 * The template for the {@link @microsoft/fast-foundation#(Tabs:class)} component.
 * @public
 */
export const tabsTemplate: (
    context: ElementDefinitionContext,
    definition: TabsOptions
) => ViewTemplate<Tabs> = (
    context: ElementDefinitionContext,
    definition: TabsOptions
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
        <div class="tabpanel">
            <slot name="tabpanel" part="tabpanel" ${slotted("tabpanels")}></slot>
        </div>
    </template>
`;
