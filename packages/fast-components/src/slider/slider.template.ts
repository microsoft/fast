import { html } from "@microsoft/fast-element";
import { Slider } from "./slider";
import { ref } from "@microsoft/fast-element/dist/directives";

export const SliderTemplate = html<Slider>`
  <template
    role="slider"
  >
    <div
          part="slider"
          class="slider"
    >
      <div part="layout-region" class="layout-region">
          <div ${ref("track")} part="track-container" class="track">
            <slot name="track"></slot>
          </div>
          <div ${ref("thumb")} part="thumb-container" class="thumb-container" style=${x =>
    x.position}>
              <slot name="thumb"><div class="thumb-cursor"></div></slot>
          </div>
          <slot></slot>
      </div>
    </div>
  </template>
`;
