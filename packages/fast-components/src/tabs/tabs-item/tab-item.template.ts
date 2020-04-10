import { html } from "@microsoft/fast-element";
import { TabItem } from "./Tab-item";

export const TabItemTemplate = html<TabItem>`
    <template
        role="tabs"
    >
        <div class="start" part="start">
            <slot name="start"></slot>
        </div>
        <div class="tablist" part="tablist" role="tablist">
            <slot class="tab" name="tab" part="tab"></slot>
        </div>
        <div class="end" part="end">
            <slot name="end"></slot>
        </div>
        <slot class="tabpanel" part="tabpanel" role="tabpanel"><slot>
    </template>
`;
