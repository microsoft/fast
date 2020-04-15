import { html, ref, slotted, when } from "@microsoft/fast-element";
import { Tabs, TabsOrientation } from "./tabs";

export const TabsTemplate = html<Tabs>`
    <template
        role="tabs"
    >
        <div class="start" part="start">
            <slot name="start"></slot>
        </div>
        <div class="tablist" part="tablist" role="tablist">
            <slot class="tab" name="tab" part="tab" ${slotted("tabs")}></slot>

            ${when(
                x => x.orientation === TabsOrientation.horizontal && x.activeIndicator,
                html<Tabs>`
                <div ${ref(
                    "activeIndicatorRef"
                )} class="activeIndicator"  part="activeIndicator">
                </div>
            `
            )}
            ${when(
                x => x.orientation === TabsOrientation.vertical && x.activeIndicator,
                html<Tabs>`
                <div ${ref(
                    "activeIndicatorRef"
                )} class="activeIndicator" part="activeIndicator">
                </div>
            `
            )}
        </div>
        <div class="end" part="end">
            <slot name="end"></slot>
        </div>
        <div class="tabpanel">
            <slot part="tabpanel" role="tabpanel" ${slotted("tabPanels")}><slot>
        </div>
    </template>
`;
