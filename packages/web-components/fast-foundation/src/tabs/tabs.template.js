import { html, ref, slotted, when } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns/start-end";
/**
 * The template for the {@link @microsoft/fast-foundation#(Tabs:class)} component.
 * @public
 */
export const tabsTemplate = (context, definition) => html`
    <template class="${x => x.orientation}">
        ${startTemplate}
        <div class="tablist" part="tablist" role="tablist">
            <slot class="tab" name="tab" part="tab" ${slotted("tabs")}></slot>

            ${when(
                x => x.showActiveIndicator,
                html`
                    <div
                        ${ref("activeIndicatorRef")}
                        class="activeIndicator"
                        part="activeIndicator"
                    ></div>
                `
            )}
        </div>
        ${endTemplate}
        <div class="tabpanel">
            <slot name="tabpanel" part="tabpanel" ${slotted("tabpanels")}></slot>
        </div>
    </template>
`;
