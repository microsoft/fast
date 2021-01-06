import { html, ref, slotted, when } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns/start-end";
import { Tabs } from "./tabs";

/**
 * The template for the {@link @microsoft/fast-foundation#(Tabs:class)} component.
 * @public
 */
export const TabsTemplate = html<Tabs>`
    <template class="${x => x.orientation}">
        <div class="tablist-container">
            ${startTemplate}
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
            ${endTemplate}
        </div>
        <div class="tabpanel">
            <slot name="tabpanel" part="tabpanel" ${slotted("tabpanels")}></slot>
        </div>
    </template>
`;
