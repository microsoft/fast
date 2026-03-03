import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { signalDone } from "../../harness.js";
import { BasicElement } from "../element.js";

RenderableFASTElement(BasicElement).defineAsync({
    name: "basic-element",
    templateOptions: "defer-and-hydrate",
});

performance.mark("bench-start");

TemplateElement.config({
    hydrationComplete() {
        performance.mark("bench-end");
        signalDone();
    },
}).define({ name: "f-template" });
