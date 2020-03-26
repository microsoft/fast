import { html, when } from "@microsoft/fast-element";
import { SliderLabel } from "./slider-label";

export const SliderLabelTemplate = html<SliderLabel>`
    <div
        part="slider-label"
        class="slider-label"
        style=${x => x.positionStyle}
    >
        <div class="slider-label-container">
            ${when(
                x => !x.hideMark,
                html`
                <div class="mark">
                </div>    
            `
            )}
            <div class="label-positioner">
                <slot name="label">
                    <span class="label"}>
                        ${x => x.label}
                    </span>
                </slot>
            </div>
        </div>
    </div>
`;
