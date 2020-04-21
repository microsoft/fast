import { html, ref, slotted, when } from "@microsoft/fast-element";
import { Tabs, TabsOrientation } from "./tabs";

export const TabsTemplate = html<Tabs>`
    <template role="tabs">
        <div name="start" part="start" ${ref("startContainer")}>
            <slot
                name="start"
                ${ref("start")}
                @slotchange=${x => x.handleStartContentChange()}
            ></slot>
        </div>
        <div class="tablist" part="tablist" role="tablist">
            <slot class="tab" name="tab" part="tab" ${slotted("tabs")}></slot>

            ${when(
                x => x.orientation === TabsOrientation.horizontal && x.activeIndicator,
                html<Tabs>`
                    <div
                        ${ref("activeIndicatorRef")}
                        class="activeIndicator"
                        part="activeIndicator"
                    ></div>
                `
            )}
            ${when(
                x => x.orientation === TabsOrientation.vertical && x.activeIndicator,
                html<Tabs>`
                    <div
                        ${ref("activeIndicatorRef")}
                        class="activeIndicator"
                        part="activeIndicator"
                    ></div>
                `
            )}
        </div>
        <div name="end" part="end" ${ref("endContainer")}>
            <slot
                name="end"
                ${ref("end")}
                @slotchange=${x => x.handleEndContentChange()}
            ></slot>
        </div>
        <div class="tabpanel">
            <slot name="tabpanel" part="tabpanel" ${slotted("tabPanels")}></slot>
        </div>
    </template>
`;
