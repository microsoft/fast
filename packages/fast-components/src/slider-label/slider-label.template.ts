import { html, when } from "@microsoft/fast-element";
import { SliderLabel } from "./slider-label";

export const SliderLabelTemplate = html<SliderLabel>`
    <div
        part="sliderlabel"
        class="sliderlabel"
        style=${x => x.positionStyle}
    >
        <div class="sliderLabel-container">
            ${when(
                x => x.showMark,
                html`
                <div class="sliderLabel-mark">
                </div>    
            `
            )}
            <slot name="label">
                <span class="sliderLabel-label"}>
                ${x => x.label}
                </span>
            </slot>
        </div>
    </div>
`;
