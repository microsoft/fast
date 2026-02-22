import { FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";
import { runBenchmark } from "../../harness.js";

class RefSlottedElement extends FASTElement {
    heading!: HTMLHeadingElement;
    slottedItems!: Element[];
}

RefSlottedElement.defineAsync({
    name: "bench-ref-slotted",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({ name: "f-template" });

await customElements.whenDefined("bench-ref-slotted");

runBenchmark(() => {
    const el = document.createElement("bench-ref-slotted") as RefSlottedElement;
    const child = document.createElement("span");
    child.textContent = "slotted content";
    el.appendChild(child);
    return el;
});
