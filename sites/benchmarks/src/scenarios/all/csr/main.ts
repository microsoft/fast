import { runBenchmark } from "../../harness.js";
import { BenchElement, template } from "../element.js";

BenchElement.define({
    name: "all-bench-element",
    template,
});

let id = 0;

runBenchmark(() => {
    const count = ++id;
    const el = document.createElement("all-bench-element") as BenchElement;
    el.count = count;
    return el;
});
