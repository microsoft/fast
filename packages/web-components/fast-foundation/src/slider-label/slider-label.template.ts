import { html, ref, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
import type { SliderLabel } from "./slider-label";

/**
 * The template for the {@link @microsoft/fast-foundation#(SliderLabel:class)} component.
 * @public
 */
export const sliderLabelTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<SliderLabel> = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => html`
    <template
        aria-disabled="${x => x.disabled}"
        class="${x => x.sliderOrientation || Orientation.horizontal}
            ${x => (x.disabled ? "disabled" : "")}"
    >
        <div ${ref("root")} part="root" class="root" style="${x => x.positionStyle}">
            <div class="container">
                ${when(
                    x => !x.hideMark,
                    html`
                        <div class="mark"></div>
                    `
                )}
                <div class="label">
                    <slot></slot>
                </div>
            </div>
        </div>
    </template>
`;
