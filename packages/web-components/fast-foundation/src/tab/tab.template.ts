import { html } from "@microsoft/fast-element";
import { Tab } from "./tab";

/**
 * The template for the {@link @microsoft/fast-foundation#Tab} component.
 * @public
 */
export const TabTemplate = html<Tab>`
    <template slot="tab" role="tab" aria-disabled="${x => x.disabled}">
        <slot></slot>
    </template>
`;
