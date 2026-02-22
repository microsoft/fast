import { FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";
import { runBenchmark } from "../../harness.js";

class BasicElement extends FASTElement {}
BasicElement.defineAsync({
    name: "bench-basic",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({ name: "f-template" });

await customElements.whenDefined("bench-basic");
runBenchmark(() => document.createElement("bench-basic"));
