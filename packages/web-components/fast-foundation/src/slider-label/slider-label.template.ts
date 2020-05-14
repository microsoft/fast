import { html, ref, when } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import { SliderLabel } from "./slider-label.js";

export const SliderLabelTemplate = html<SliderLabel>`
    <template
        aria-disabled="${x => x.disabled}"
        class="${x => x.sliderOrientation || Orientation.horizontal} 
            ${x => (x.disabled ? "disabled" : "")}"
    >
        <div ${ref("root")} part="root" class="root" style=${x => x.positionStyle}>
            <div class="container">
                ${when(x => !x.hideMark, html` <div class="mark"></div> `)}
                <div class="label">
                    <slot> </slot>
                </div>
            </div>
        </div>
    </template>
`;
