import { neutralLayerL1Behavior } from "@fluentui/web-components";
import { css } from "@microsoft/fast-element";
import { mixin_cardTitle } from "./typography";

export const styles_cardHeading = css`
  .heading {
    background-color: ${neutralLayerL1Behavior.var};
    border-bottom: 1px solid rgba(0,0,0,0.12);
    ${mixin_cardTitle}
    font-size: 20px;
    margin: -4px -16px 0 -16px;
    padding: 8px 16px;
  }
`.withBehaviors(neutralLayerL1Behavior);

export const mixin_screen = (display: string = 'block') => `
  contain: content;
  display: ${display};
  height: 100%;
  width: 100%;
  overflow-y: auto;
`;

export const mixin_cardStyles = `
  padding: 4px 16px 16px 16px;
`;

export const mixin_boxShadow = `
  --elevation: 4;
  box-shadow: 0 0 calc((var(--elevation) * 0.225px) + 2px) rgba(0, 0, 0, calc(0.11 * (2 - var(--background-luminance, 1)))), 0 calc(var(--elevation) * 0.4px) calc((var(--elevation) * 0.9px)) rgba(0, 0, 0, calc(0.13 * (2 - var(--background-luminance, 1))));
`;

export const styles_animation = `
    :host {
        --animation-ease-in-fast: all ease-in 0.15s;
    }

    @keyframes fadeIn {
        0% {opacity: 0;}
        100% {opacity: 1;}
    }

    .fade-in {
        animation: fadeIn ease-in 0.2s;
    }
`;