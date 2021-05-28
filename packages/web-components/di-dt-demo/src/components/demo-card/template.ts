import { html } from "@microsoft/fast-element";
import { ElementDefinitionContext } from "@microsoft/fast-foundation";

export const template = (context: ElementDefinitionContext) =>
    html`
        <slot></slot>
    `;
