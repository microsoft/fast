import { html, ref, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { SliderLabel } from "./slider-label.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(SliderLabel:class)} component.
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
