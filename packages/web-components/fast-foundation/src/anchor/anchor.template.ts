import { html } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns/start-end";
import { Anchor } from "./anchor";

/**
 * The template for the {@link @microsoft/fast-foundation#(Anchor:class)} component.
 * @public
 */
export const AnchorTemplate = html<Anchor>`
    <template class="${x => x.appearance}">
        <a
            class="control"
            part="control"
            download="${x => x.download}"
            href="${x => x.href}"
            hreflang="${x => x.hreflang}"
            ping="${x => x.ping}"
            referrerpolicy="${x => x.referrerpolicy}"
            rel="${x => x.rel}"
            target="${x => x.target}"
            type="${x => x.type}"
        >
            ${startTemplate}
            <span class="content" part="content">
                <slot></slot>
            </span>
            ${endTemplate}
        </a>
    </template>
`;
