import { FASTElement, observable } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { signalDone } from "../../harness.js";

class BindAttrElement extends FASTElement {
    @observable value: string = "test";
    @observable disabled: boolean = false;
    @observable title: string = "Test Title";
}

RenderableFASTElement(BindAttrElement).defineAsync({
    name: "bench-bind-attr",
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
