import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { Divider } from "./divider";

/**
 * The template for the {@link @microsoft/fast-foundation#Divider} component.
 * @public
 */
export const dividerTemplate: (context, definition) => ViewTemplate<Divider> = (
    context,
    definition
) => html`
    <template role="${x => x.role}"></template>
`;
