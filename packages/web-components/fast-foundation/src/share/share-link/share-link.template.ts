import { html, slotted, elements } from "@microsoft/fast-element";
import { ShareLink } from "./share-link";

/**
 * The template for the {@link @microsoft/fast-foundation#ShareLink} component.
 * @public
 */
export const ShareLinkTemplate = html<ShareLink>`
    <template class="share-link" aria-label="${x => x.title}">
        <div
            class="icon-container"
            style="${x => (x.color ? `background-color: ${x.color}` : void 0)}"
        >
            <slot></slot>
        </div>
        <h4 class="title">${x => x.title}</h4>
    </template>
`;
