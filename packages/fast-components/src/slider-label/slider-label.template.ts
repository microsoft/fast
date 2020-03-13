import { html, when } from "@microsoft/fast-element";
import { SliderLabel } from "./slider-label";

export const SliderLabelTemplate = html<SliderLabel>`
    <div
        part="sliderlabel"
        class="sliderlabel"
        style=${x => x.positionStyle}
    >
        <div class="sliderLabel_container">
            <div class="sliderLabel_mark">
            </div>
            <span class="sliderLabel_label"}>
            ${x => x.label}
            </span>
        </div>
    </div>
`;
