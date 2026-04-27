import { FASTElement } from "@microsoft/fast-element";
import { html } from "@microsoft/fast-element/html.js";
export class BenchElement extends FASTElement {}

export const template = html`
    <slot></slot>
`;
