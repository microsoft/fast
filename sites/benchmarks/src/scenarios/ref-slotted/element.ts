import { FASTElement } from "@microsoft/fast-element";
import { ref } from "@microsoft/fast-element/ref.js";
import { slotted } from "@microsoft/fast-element/slotted.js";
import { html } from "@microsoft/fast-element/template.js";

export class BenchElement extends FASTElement {
    heading!: HTMLHeadingElement;
    slottedItems!: Element[];
}

export const template = html<BenchElement>`
    <h3 ${ref("heading")}>Title</h3>
    <slot ${slotted("slottedItems")}></slot>
`;
