import { FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";
import { runBenchmark } from "../../harness.js";

const items = Array.from({ length: 20 }, (_, i) => `Item ${i}`);

class RepeatCreateElement extends FASTElement {
    items = items;
}

RepeatCreateElement.defineAsync({
    name: "bench-repeat-create",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({ name: "f-template" });

await customElements.whenDefined("bench-repeat-create");

runBenchmark(() => document.createElement("bench-repeat-create"));
