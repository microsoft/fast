import { html, ref, when } from "@ni/fast-element";
import type { ViewTemplate } from "@ni/fast-element";
import { Orientation } from "@ni/fast-web-utilities";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { SliderLabel } from "./slider-label.js";

/**
 * The template for the {@link @ni/fast-foundation#(SliderLabel:class)} component.
 * @public
 */
export const sliderLabelTemplate: FoundationElementTemplate<ViewTemplate<SliderLabel>> = (
    context,
    definition
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
