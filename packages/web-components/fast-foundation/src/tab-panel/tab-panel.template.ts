import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
import type { TabPanel } from "./tab-panel";
/**
 * The template for the {@link @microsoft/fast-foundation#TabPanel} component.
 * @public
 */
export const tabPanelTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<TabPanel> = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => html`
    <template slot="tabpanel" role="tabpanel">
        <slot></slot>
    </template>
`;
