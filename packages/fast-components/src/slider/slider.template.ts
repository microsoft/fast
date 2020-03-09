import { html, when } from "@microsoft/fast-element";
import { Slider } from "./slider";
//import { bool } from "../utilities";

export const SliderTemplate = html<Slider>`
    <div
        part="slider"
        class="slider"
    >
    <slot name="label">
      <div>${x => x.label}</div>
    </slot>
    <div part="layout-region" class="layout-region">
      <slot name="background-track">
        <div part="background-track" class="background-track"></div>
      </slot>
      <slot name="track">
        <div part="track" class="track"></div>
      </slot>
      <slot name="thumb">
        <div part="thumb" class="thumb">test</div>
      </slot>
      ${when(
          x => x.childNodes.length,
          html`
          <slot></slot>
      `
      )}
      </div>
    </div>
`;
