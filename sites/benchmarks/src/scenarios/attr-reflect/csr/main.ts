import { runBenchmark } from "../../harness.js";
import { BenchElement, template } from "../element.js";

BenchElement.define({
    name: "attr-reflect-bench-element",
    template,
});

let id = 0;

runBenchmark(() => {
    const count = ++id;
    const el = document.createElement("attr-reflect-bench-element") as BenchElement;
    el.label = `item-${count}`;
    el.count = count;
    el.active = true;
    return el;
});
