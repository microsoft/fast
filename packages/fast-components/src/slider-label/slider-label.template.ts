import { html, when } from "@microsoft/fast-element";
import { bool } from "../utilities";
import { SliderLabel } from "./slider-label";

export const SliderLabelTemplate = html<SliderLabel>`
    <div
        part="sliderlabel"
        class="sliderlabel"
        style=${x => x.positionStyle}
    >
        <div class="sliderLabel-container">
            ${when(
                x => bool(x.showMark),
                html`
                <div class="sliderLabel-mark">
                </div>    
            `
            )}
            <div class="sliderLabel-labelPositioner">
                <slot name="label">
                    <span class="sliderLabel-label"}>
                    ${x => x.label}
                    </span>
                </slot>
            </div>
        </div>
    </div>
`;
