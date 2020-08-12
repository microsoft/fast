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
    color: var(--neutral-foreground-res);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 100%;
  }

  .square {
    border-radius: 5px;
    min-width: 100%;
  }

  .coin {
    position: relative;
    background-color: var(--accent-fill-rest);
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
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .name {
    font-size: var(--type-ramp-plus-3-font-size);
    line-height: var(--type-ramp-plus-3-line-height);
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