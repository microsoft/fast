import { attr, FASTElement } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { signalDone } from "../../harness.js";

class AttrElement extends FASTElement {
    @attr label: string = "";
    @attr count: string = "0";
    @attr({ mode: "boolean" }) active: boolean = false;
}

RenderableFASTElement(AttrElement).defineAsync({
    name: "bench-attr",
    templateOptions: "defer-and-hydrate",
});

performance.mark("bench-start");

TemplateElement.config({
    hydrationComplete() {
        performance.mark("bench-end");
        performance.measure("bench", "bench-start", "bench-end");
        signalDone();
    },
}).define({ name: "f-template" });
