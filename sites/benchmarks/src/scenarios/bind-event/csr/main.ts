import { runBenchmark } from "../../harness.js";
import { BenchElement, template } from "../element.js";

BenchElement.define({
    name: "bind-event-bench-element",
    template,
});

runBenchmark(() => document.createElement("bind-event-bench-element"));
