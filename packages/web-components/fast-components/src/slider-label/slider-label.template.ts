import { html, ref, when } from "@microsoft/fast-element";
import { SliderLabel } from "./slider-label";
import { SliderOrientation } from "../slider";

export const SliderLabelTemplate = html<SliderLabel>`
    <template
        aria-disabled="${x => x.disabled}"
        class="${x =>
            x.sliderOrientation === SliderOrientation.horizontal
                ? "horizontal"
                : "vertical"} 
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
