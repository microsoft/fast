import { runBenchmark } from "../../harness.js";
import { BenchElement, template } from "../element.js";

BenchElement.define({
    name: "basic-bench-element",
    template,
});

runBenchmark(() => {
    const el = document.createElement("basic-bench-element");
    el.innerHTML = "hello";
    return el;
});
