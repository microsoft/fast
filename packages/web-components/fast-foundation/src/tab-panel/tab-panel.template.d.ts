import type { ViewTemplate } from "@microsoft/fast-element";
import type { TabPanel } from "./tab-panel";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
/**
 * The template for the {@link @microsoft/fast-foundation#TabPanel} component.
 * @public
 */
export declare const tabPanelTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<TabPanel>;
