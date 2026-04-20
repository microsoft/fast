import { runBenchmark } from "../../harness.js";
import { BenchElement, template } from "../element.js";

BenchElement.define({
    name: "ref-slotted-bench-element",
    template,
});

runBenchmark(() => {
    const el = document.createElement("ref-slotted-bench-element") as BenchElement;
    const child = document.createElement("span");
    child.textContent = "slotted content";
    el.appendChild(child);
    return el;
});
