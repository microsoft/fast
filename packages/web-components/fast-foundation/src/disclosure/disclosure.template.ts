import { html, ref } from "@microsoft/fast-element";
import { Disclosure } from "./disclosure";

/**
 * The template for the {@link @microsoft/fast-foundation#Disclosure} component.
 * @public
 */
export const DisclosureTemplate = html<Disclosure>`
    <template>
        <details class="disclosure" ${ref("details")}>
            <summary
                class="invoker"
                role="button"
                aria-controls="${x => x.ariaControls}"
                aria-expanded="${x => x.ariaExpanded}"
            >
                <slot name="start"></slot>
                <slot name="title">${x => x.title}</slot>
                <slot name="end"></slot>
            </summary>
            <div id="${x => x.ariaControls}"><slot></slot></div>
        </details>
    </template>
`;
