import { html } from "@microsoft/fast-element";
import { Slider } from "./slider";
import { ref } from "@microsoft/fast-element/dist/directives";

export const SliderTemplate = html<Slider>`
  <div
        part="slider"
        class="slider"
  >
    <slot name="label">
      <div>${x => x.label}</div>
    </slot>
    <div part="layout-region" class="layout-region">
        <div ${ref("backgroundTrack")} part="background-track" class="background-track">
          <slot name="background-track"></slot>
        </div>
        <slot name="track">
          <div part="track" class="track"></div>
        </slot>
        <div ${ref("thumb")} part="thumb-container" class="thumb-container" style=${x =>
    x.position}>
            <slot name="thumb"><div class="thumb-cursor"></div></slot>
        </div>
        <slot></slot>
    </div>
  </div>
`;
