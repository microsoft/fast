import { html } from "@microsoft/fast-element";
import { ref } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import { Slider } from "./slider";

/**
 * The template for the {@link @microsoft/fast-foundation#Slider} component.
 * @public
 */
export const SliderTemplate = html<Slider>`
    <template
        role="slider"
        class="${x => (x.readOnly ? "readonly" : "")} 
        ${x => x.orientation || Orientation.horizontal}"
        tabindex="${x => (x.disabled ? null : 0)}"
        aria-valuetext="${x => x.valueTextFormatter(x.value)}"
        aria-valuenow="${x => x.value}"
        aria-valuemin="${x => x.min}"
        aria-valuemax="${x => x.max}"
        ?aria-disabled="${x => x.disabled}"
        ?aria-readonly="${x => x.readOnly}"
        aria-orientation="${x => x.orientation}"
        class="${x => x.orientation}"
    >
        <div part="positioning-region" class="positioning-region">
            <div ${ref("track")} part="track-container" class="track">
                <slot name="track"></slot>
            </div>
            <div></div>
            <slot></slot>
            <div
                ${ref("thumb")}
                part="thumb-container"
                class="thumb-container"
                style=${x => x.position}
            >
                <slot name="thumb"><div class="thumb-cursor"></div></slot>
            </div>
        </div>
    </template>
`;
