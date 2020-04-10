import { html, slotted } from "@microsoft/fast-element";
import { Tabs } from "./tabs";

export const TabsTemplate = html<Tabs>`
    <template
        role="tabs"
    >
        <div class="start" part="start">
            <slot name="start"></slot>
        </div>
        <div class="tablist" part="tablist" role="tablist">
            <slot class="tab" name="tab" part="tab" ${slotted("tabs")}></slot>
        </div>
        <div class="end" part="end">
            <slot name="end"></slot>
        </div>
        <div class="tabpanel">
            <slot part="tabpanel" role="tabpanel" ${slotted("tabPanels")}><slot>
        </div>
    </template>
`;
