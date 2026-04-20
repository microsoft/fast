import { FASTElement, html } from "@microsoft/fast-element";

export class BenchElement extends FASTElement {}

export const template = html`
    <slot></slot>
`;
