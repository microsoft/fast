import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import {
  accentFillRestBehavior,
  heightNumber,	
  neutralForegroundRestBehavior
} from "../styles/index";

export const AvatarStyles = css`
  ${display("flex")} 
  :host {
    max-width: calc(${heightNumber} * 2.5px);
    height: calc(${heightNumber} * 2.5px);
    position: relative;
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
    min-width: 100%;
    position: absolute;
    display: block;
  }

  .name {
    font-size: var(--type-ramp-plus-5-font-size);
    line-height: var(--type-ramp-plus-5-line-height);
    display: block;
  }

  ::slotted(fast-badge) {
    --badge-fill-primary: #00FF00;
    position: absolute;
    display: block;
    bottom: 0;
    right:0;
  }
`.withBehaviors(
  accentFillRestBehavior,
  neutralForegroundRestBehavior
);
