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
        <slot name="thumb">
          <div part="thumb" class="thumb" style=${x => x.position}></div>
        </slot>
        <slot></slot>
    </div>
  </div>
`;
