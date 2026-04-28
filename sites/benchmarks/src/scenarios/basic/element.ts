import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { html } from "@microsoft/fast-element/html.js";
export class BenchElement extends FASTElement {}

export const template = html`
    <slot></slot>
`;
