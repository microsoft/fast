import { ElementViewTemplate, html, ref } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import type { FASTSlider, SliderOptions } from "./slider.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTSlider:class)} component.
 * @public
 */
export function sliderTemplate(
    options: SliderOptions = {}
): ElementViewTemplate<FASTSlider> {
    return html<FASTSlider>`
        <template
            role="slider"
            class="${x => (x.readOnly ? "readonly" : "")}
        ${x => x.orientation || Orientation.horizontal}"
            tabindex="${x => (x.disabled ? null : 0)}"
            aria-valuetext="${x => x.valueTextFormatter(x.value)}"
            aria-valuenow="${x => x.value}"
            aria-valuemin="${x => x.min}"
            aria-valuemax="${x => x.max}"
            aria-disabled="${x => (x.disabled ? true : void 0)}"
            aria-readonly="${x => (x.readOnly ? true : void 0)}"
            aria-orientation="${x => x.orientation}"
            class="${x => x.orientation}"
        >
            <div part="positioning-region" class="positioning-region">
                <div ${ref("track")} part="track-container" class="track">
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
                    ${ref("thumb")}
                    part="thumb-container"
                    class="thumb-container"
                    style="${x => x.position}"
                >
                    <slot name="thumb">${options.thumb || ""}</slot>
                </div>
            </div>
        </template>
    `;
}
