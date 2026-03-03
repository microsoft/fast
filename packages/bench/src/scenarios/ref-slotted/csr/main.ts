import { html, ref, slotted } from "@microsoft/fast-element";
import { runBenchmark } from "../../harness.js";
import { BenchElement } from "../element.js";

BenchElement.define({
    name: "bench-element",
    template: html<BenchElement>`
        <h3 ${ref("heading")}>Title</h3>
        <slot ${slotted("slottedItems")}></slot>
    `,
});

runBenchmark(() => {
    const el = document.createElement("bench-element") as BenchElement;
    const child = document.createElement("span");
    child.textContent = "slotted content";
    el.appendChild(child);
    return el;
});
