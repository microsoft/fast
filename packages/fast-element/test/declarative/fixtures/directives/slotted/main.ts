import { FASTElement, observable } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-element/declarative.js";

class TestElement extends FASTElement {
    @observable
    slottedNodes: Node[] = [];

    @observable
    slottedFooNodes: Node[] = [];

    slottedFooNodesChanged() {
        this.classList.add(`class-${this.slottedFooNodes.length}`);
    }

    @observable
    slottedBarNodes: Node[] = [];
}
TestElement.define({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.config({
    hydrationComplete() {
        (window as any).hydrationCompleted = true;
    },
}).define({
    name: "f-template",
});
