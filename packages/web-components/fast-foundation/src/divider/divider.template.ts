import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { Divider } from "./divider.js";

/**
 * The template for the {@link @microsoft/fast-foundation#Divider} component.
 * @public
 */
export const dividerTemplate: FoundationElementTemplate<ViewTemplate<Divider>> = (
    context,
    definition
) => html`
    <template role="${x => x.role}" aria-orientation="${x => x.orientation}"></template>
`;
