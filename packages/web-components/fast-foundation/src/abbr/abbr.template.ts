import { html, ref, ViewTemplate } from "@microsoft/fast-element";
import { Tooltip } from "../tooltip";
import type { ElementDefinitionContext } from "../design-system";
import type { FoundationElementDefinition } from "../foundation-element";
import type { Abbr } from "./abbr";

/**
 * The template for the {@link @microsoft/fast-foundation#Abbr} component.
 * @public
 */
export const abbrTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<Abbr> = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => html<Abbr>`
    <template
      @mouseover=${(x, c) => x.handleMouseOver(c.event as MouseEvent)}
      @mouseout=${(x, c) => x.handleMouseOut(c.event as MouseEvent)}
      ${ref("root")}
    >
        <slot></slot>
        <${context.tagFor(Tooltip)}
          part="tooltip"
          class="tooltip"
          position=${x => x.position}
          visible=${x => x.showTooltip}
          delay=${x => x.delay}
          ${ref("tooltip")}
        >${x => x.text}</${context.tagFor(Tooltip)}>
    </template>
`;
