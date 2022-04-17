import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { Tab } from "./tab.js";

/**
 * The template for the {@link @microsoft/fast-foundation#Tab} component.
 * @public
 */
export const tabTemplate: FoundationElementTemplate<ViewTemplate<Tab>> = (
    context,
    definition
) => html`
    <template slot="tab" role="tab" aria-disabled="${x => x.disabled}">
        <slot></slot>
    </template>
`;
