import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { Divider } from "./divider";

/**
 * The template for the {@link @microsoft/fast-foundation#Divider} component.
 * @public
 */
export const DividerTemplate: ViewTemplate<Divider> = html`
    <template role="${x => x.role}"></template>
`;
