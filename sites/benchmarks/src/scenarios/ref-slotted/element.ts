import { FASTElement, html, ref, slotted } from "@microsoft/fast-element";

export class BenchElement extends FASTElement {
    heading!: HTMLHeadingElement;
    slottedItems!: Element[];
}

export const template = html<BenchElement>`
    <h3 ${ref("heading")}>Title</h3>
    <slot ${slotted("slottedItems")}></slot>
`;
