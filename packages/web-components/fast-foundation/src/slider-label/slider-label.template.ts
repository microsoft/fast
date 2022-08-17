import { ElementViewTemplate, html, ref, when } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import type { FASTSliderLabel } from "./slider-label.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTSliderLabel:class)} component.
 * @public
 */
export function sliderLabelTemplate<T extends FASTSliderLabel>(): ElementViewTemplate<T> {
    return html<T>`
        <template
            aria-disabled="${x => x.disabled}"
            class="${x => x.sliderOrientation || Orientation.horizontal}
            ${x => (x.disabled ? "disabled" : "")}"
        >
            <div
                ${ref("container")}
                part="container"
                class="container"
                style="${x => x.positionStyle}"
            >
                ${when(
                    x => !x.hideMark,
                    html`
                        <div class="mark"></div>
                    `
                )}
                <span class="content">
                    <slot></slot>
                </span>
            </div>
        </template>
    `;
}
