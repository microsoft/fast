import { html, slotted, elements } from "@microsoft/fast-element";
import { ShareGroup } from "./share-group";

/**
 * The template for the {@link @microsoft/fast-foundation#ShareGroup} component.
 * @public
 */
export const ShareGroupTemplate = html<ShareGroup>`
    <template class="share-group" aria-label="${x => x.title}">
        <h3>${x => x.title}</h3>
        <div class="links-container">
            <slot ${slotted({ property: "items", filter: elements() })}></slot>
        </div>
    </template>
`;
