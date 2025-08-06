import type { ElementViewTemplate } from "@microsoft/fast-element";
import { html, ref } from "@microsoft/fast-element";
import { staticallyCompose } from "../utilities/template-helpers.js";
import type { FASTSlider } from "./slider.js";
import type { SliderOptions } from "./slider.options.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTSlider:class)} component.
 * @public
 */
export function sliderTemplate<T extends FASTSlider>(
    options: SliderOptions = {}
): ElementViewTemplate<T> {
    return html<T>`
        <template
            role="slider"
            tabindex="${x => (x.disabled ? null : 0)}"
            aria-valuetext="${x => x.valueTextFormatter(x.value)}"
            aria-valuenow="${x => x.value}"
            aria-valuemin="${x => x.min}"
            aria-valuemax="${x => x.max}"
            aria-disabled="${x => (x.disabled ? true : void 0)}"
            aria-orientation="${x => x.orientation}"
        >
            <div part="positioning-region" class="positioning-region">
                <div ${ref("track")} part="track" class="track">
                    <slot name="track"></slot>
                    <div
                        part="track-start"
                        class="track-start"
                        style="${x => x.position}"
                    >
                        <slot name="track-start"></slot>
                    </div>
                </div>
                <slot></slot>
                <div
                    ${ref("thumbContainer")}
                    part="thumb-container"
                    class="thumb-container"
                    style="${x => x.position}"
                >
                    <div class="thumb" part="thumb">
                        <slot name="thumb">${staticallyCompose(options.thumb)}</slot>
                    </div>
                </div>
            </div>
        </template>
    `;
}
