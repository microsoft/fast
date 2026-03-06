import { TemplateElement } from "@microsoft/fast-html";
import { runBenchmark } from "../../harness.js";
import { BenchElement } from "../element.js";

BenchElement.defineAsync({
    name: "bench-element",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.options({
    "bench-element": { observerMap: "all" },
}).define({ name: "f-template" });

await customElements.whenDefined("bench-element");

runBenchmark(() => document.createElement("bench-element"));
