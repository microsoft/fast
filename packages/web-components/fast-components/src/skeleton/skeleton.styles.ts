import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import {
  neutralFillRestBehavior
} from "../styles";

export const SkeletonStyles = css`
  ${display("block")} :host {
    overflow: hidden;
    width: 100%;
    position: relative;
    background-color: ${neutralFillRestBehavior.var};
    --skeleton-animation-gradient-default: linear-gradient(270deg, ${neutralFillRestBehavior.var} 0%, #F3F2F1 51.13%, ${neutralFillRestBehavior.var} 100%);
  }

  :host(.rect) {
    border-radius: calc(var(--corner-radius) * 1px);
  }

  :host(.circle) {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    overflow: hidden;
  }

  object {
    position: absolute;
    width: 100%;
    height: auto;
    z-index: 1000
  }

  object img {
    width: 100%;
    height: auto;
  }
  
  ::slotted(.shimmer) {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: var(--skeleton-animation-gradient, var(--skeleton-animation-gradient-default));
    background-size: 0px 0px / 90% 100%;
    background-repeat: no-repeat;
    background-color: var(--skeleton-animation-fill, ${neutralFillRestBehavior.var});
    animation: shimmer 2s infinite;
    animation-timing-function: var(--skeleton-animation-timing, ease-in-out);
    animation-direction: normal;
    z-index: 1;
  }

  ::slotted(svg) {
    z-index: 9999;
  }

  ::slotted(.pattern) {
    width: 100%;
    height: 100%;
  }

`.withBehaviors(
  neutralFillRestBehavior
);
