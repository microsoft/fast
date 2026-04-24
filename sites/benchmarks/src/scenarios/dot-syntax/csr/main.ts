import { TemplateElement } from "@microsoft/fast-element/declarative.js";
import { runBenchmark } from "../../harness.js";
import { BenchElement } from "../element.js";

BenchElement.define({
    name: "dot-syntax-bench-element",
});

TemplateElement.options({
    "dot-syntax-bench-element": { observerMap: "all" },
}).define({ name: "f-template" });

await customElements.whenDefined("dot-syntax-bench-element");

runBenchmark(() => document.createElement("dot-syntax-bench-element"));
