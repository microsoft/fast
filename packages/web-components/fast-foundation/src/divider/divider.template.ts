import { html } from "@ni/fast-element";
import type { ViewTemplate } from "@ni/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { Divider } from "./divider.js";

/**
 * The template for the {@link @ni/fast-foundation#Divider} component.
 * @public
 */
export const dividerTemplate: FoundationElementTemplate<ViewTemplate<Divider>> = (
    context,
    definition
) => html`
    <template role="${x => x.role}" aria-orientation="${x => x.orientation}"></template>
`;
