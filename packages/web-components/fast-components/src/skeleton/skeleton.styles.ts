import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import {
  neutralFillRestBehavior
} from "../styles";

export const SkeletonStyles = css`
  ${display("block")} :host {

    background-color: ${neutralFillRestBehavior.var};
    overflow: hidden;
    position: relative;
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

  .shimmer {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(270deg, ${neutralFillRestBehavior.var} 0%, #F3F2F1 51.13%, ${neutralFillRestBehavior.var} 100%)0px 0px / 90% 100% no-repeat ${neutralFillRestBehavior.var};
    background-size: 125px 250px;
    animation: shimmer 2s infinite;
    animation-timing-function: ease-in-out;
    animation-direction: normal;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`.withBehaviors(
  neutralFillRestBehavior
);
