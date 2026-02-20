import { attr, FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";
import { runBenchmark } from "../../harness.js";

class BindTextElement extends FASTElement {
    @attr label: string = "Hello";
}

BindTextElement.defineAsync({
    name: "bench-bind-text",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({ name: "f-template" });

await customElements.whenDefined("bench-bind-text");
runBenchmark(() => document.createElement("bench-bind-text"));
