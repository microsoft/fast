import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type {
    FoundationElementDefinition,
    FoundationElementTemplate,
} from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
import type { Divider } from "./divider";

/**
 * The template for the {@link @microsoft/fast-foundation#Divider} component.
 * @public
 */
export const dividerTemplate: FoundationElementTemplate<ViewTemplate<Divider>> = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => html`
    <template role="${x => x.role}"></template>
`;
