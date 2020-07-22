import { html, slotted, elements, when, ref } from "@microsoft/fast-element";
import { Share } from "./share";

/**
 * The template for the {@link @microsoft/fast-foundation#Share} component.
 * @public
 */
export const ShareTemplate = html<Share>`
    <template class="share" aria-label="${x => x.title}">
        <h2>${x => x.title}</h2>
        <slot name="tab-info" part="tab-info" ${slotted("tabItem")}></slot>
        ${when(
            x => x.tabItem && x.tabItem.length > 0,
            html`
                <fast-divider></fast-divider>
            `
        )}
        <div class="content" part="content">
            <slot></slot>
        </div>
    </template>
`;
