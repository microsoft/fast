import { html, when } from "@microsoft/fast-element";
import { bool } from "../utilities";
import { SliderLabel } from "./slider-label";

export const SliderLabelTemplate = html<SliderLabel>`
    <div
        part="slider-label"
        class="slider-label"
        style=${x => x.positionStyle}
    >
        <div class="slider-label-container">
            ${when(
                x => bool(x.showMark),
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
