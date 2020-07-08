import { html, ref, when } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import { SliderLabel } from "./slider-label";

/**
 * The template for the {@link @microsoft/fast-foundation#SliderLabel} component.
 * @public
 */
export const SliderLabelTemplate = html<SliderLabel>`
    <template
        aria-disabled="${x => x.disabled}"
        class="${x => x.sliderOrientation || Orientation.horizontal}
            ${x => (x.disabled ? "disabled" : "")}"
    >
        <div ${ref("root")} part="root" class="root" style="${x => x.positionStyle}">
            <div class="container">
                ${when(
                    x => !x.hideMark,
                    html`&nbsp;
                        <div class="mark"></div>
                        &nbsp;`
                )}
                <div class="label">
                    <slot></slot>
                </div>
            </div>
        </div>
    </template>
`;
