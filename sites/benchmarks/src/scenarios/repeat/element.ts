import { FASTElement } from "@microsoft/fast-element";

const items = Array.from({ length: 20 }, (_, i) => `Item ${i}`);

export class BenchElement extends FASTElement {
    items = items;
}
