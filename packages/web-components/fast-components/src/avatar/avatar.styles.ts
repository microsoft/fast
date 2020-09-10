import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import {
  accentFillRestBehavior,
  neutralForegroundRestBehavior
} from "../styles/index";

export const AvatarStyles = css`
  ${display("flex")} 
  :host {
    max-width: var(--avatar-size);
    height: var(--avatar-size);
    position: relative;
    --avatar-text-size: var(--type-ramp-base-font-size);
    --avatar-text-ratio: var(--design-unit);
  }
  
  .link {
    text-decoration: none;
    color: ${neutralForegroundRestBehavior.var};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 100%;
  }

  .square {
    border-radius: calc(var(--corner-radius) * 1px);
    min-width: 100%;
    overflow: hidden;
  }

  .coin {
    position: relative;
    display: flex;
  }

  .circle {
    border-radius: 100%;
    min-width: 100%;
    overflow: hidden;
  }

  .image {
    width: 100%;
    position: absolute;
    display: block;
  }

  .name {
    font-size: calc((var(--avatar-text-size) + var(--avatar-size)) / var(--avatar-text-ratio));
    line-height: var(--type-ramp-plus-5-line-height);
    display: block;
  }

  ::slotted(fast-badge) {
    position: absolute;
    display: block;
    bottom: 0;
    right: 0;
  }
`.withBehaviors(
  accentFillRestBehavior,
  neutralForegroundRestBehavior
);
