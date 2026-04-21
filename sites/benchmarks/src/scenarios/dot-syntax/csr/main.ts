import { observerMap, TemplateElement } from "@microsoft/fast-html";
import { runBenchmark } from "../../harness.js";
import { BenchElement } from "../element.js";

BenchElement.defineAsync({
    name: "dot-syntax-bench-element",
    templateOptions: "defer-and-hydrate",
});

observerMap()("dot-syntax-bench-element");

TemplateElement.define({ name: "f-template" });

await customElements.whenDefined("dot-syntax-bench-element");

runBenchmark(() => document.createElement("dot-syntax-bench-element"));
