import { ElementViewTemplate, html, ref, when } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import type { FASTSliderLabel } from "./slider-label.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTSliderLabel:class)} component.
 * @public
 */
export function sliderLabelTemplate<T extends FASTSliderLabel>(): ElementViewTemplate<T> {
    return html<T>`
        <template aria-disabled="${x => x.disabled}">
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
}
