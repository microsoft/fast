import { html, when } from "@microsoft/fast-element";
import { SliderLabel } from "./slider-label";

export const SliderLabelTemplate = html<SliderLabel>`
    <div
        part="sliderlabel"
        class="sliderlabel"
        style=${x => this.positionStyle}
    >
        <span class="sliderLabel_label"}>
            ${x => x.label}
        </span>
        ${when(
            x => x.showMark,
            html`
            <div class="sliderLabel_mark">
            </div>
        `
        )}
    </div>
`;
