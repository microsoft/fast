import { html, ref } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import type { Slider, SliderOptions } from "./slider";
import type { ElementDefinitionContext } from "../design-system";

/**
 * The template for the {@link @microsoft/fast-foundation#(Slider:class)} component.
 * @public
 */
export const sliderTemplate: (
    context: ElementDefinitionContext,
    definition: SliderOptions
) => ViewTemplate<Slider> = (
    context: ElementDefinitionContext,
    definition: SliderOptions
) => html`
    <template
        role="slider"
        class="${x => (x.readOnly ? "readonly" : "")}
        ${x => x.orientation || Orientation.horizontal}"
        tabindex="${x => (x.disabled ? null : 0)}"
        aria-valuetext="${x => x.valueTextFormatter(x.value)}"
        aria-valuenow="${x => x.value}"
        aria-valuemin="${x => x.min}"
        aria-valuemax="${x => x.max}"
        aria-disabled="${x => (x.disabled ? true : void 0)}"
        aria-readonly="${x => (x.readOnly ? true : void 0)}"
        aria-orientation="${x => x.orientation}"
        class="${x => x.orientation}"
    >
        <div part="positioning-region" class="positioning-region">
            <div ${ref("track")} part="track-container" class="track">
                <slot name="track"></slot>
            </div>
            <slot></slot>
            <div
                ${ref("thumb")}
                part="thumb-container"
                class="thumb-container"
                style="${x => x.position}"
            >
                <slot name="thumb">${definition.thumb || ""}</slot>
            </div>
        </div>
    </template>
`;
