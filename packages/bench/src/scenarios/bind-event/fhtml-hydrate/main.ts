import { FASTElement, observable } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { signalDone } from "../../harness.js";

class BindEventElement extends FASTElement {
    @observable count: number = 0;

    handleClick(): void {
        this.count++;
    }
}

RenderableFASTElement(BindEventElement).defineAsync({
    name: "bench-bind-event",
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
