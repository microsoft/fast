import { html, when } from "@microsoft/fast-element";
import { SliderLabel } from "./slider-label";
import { SliderOrientation } from "../slider";

export const SliderLabelTemplate = html<SliderLabel>`
    <template
        class=${x =>
            x.config.orientation === SliderOrientation.horizontal
                ? "slider-label-horizontal"
                : "slider-label-vertical"}
        style=${x => x.positionStyle}
    >
        <div part="container" class="container">
            ${when(
                x => !x.hideMark,
                html`
                <div class="mark">
                </div>    
            `
            )}
            <div part="label" class="label">
                <slot>
                </slot>
            </div>
        </div>
    </template>
`;
