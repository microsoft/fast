import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { signalDone } from "../../harness.js";
import { BenchElement } from "../element.js";

RenderableFASTElement(BenchElement).define({
    name: "bind-event-bench-element",
    templateOptions: "defer-and-hydrate",
});

performance.mark("bench-start");

TemplateElement.config({
    hydrationComplete() {
        performance.mark("bench-end");
        signalDone();
    },
}).define({ name: "f-template" });
