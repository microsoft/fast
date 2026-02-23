import { FASTElement, html, ref, slotted } from "@microsoft/fast-element";
import { runBenchmark } from "../../harness.js";

class RefSlottedElement extends FASTElement {
    heading!: HTMLHeadingElement;
    slottedItems!: Element[];
}

RefSlottedElement.define({
    name: "bench-ref-slotted",
    template: html<RefSlottedElement>`
        <h3 ${ref("heading")}>Title</h3>
        <slot ${slotted("slottedItems")}></slot>
    `,
});

runBenchmark(() => {
    const el = document.createElement("bench-ref-slotted") as RefSlottedElement;
    const child = document.createElement("span");
    child.textContent = "slotted content";
    el.appendChild(child);
    return el;
});
