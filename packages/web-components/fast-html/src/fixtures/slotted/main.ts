import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { observable } from "@microsoft/fast-element";

class TestElement extends RenderableFASTElement {
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
    shadowOptions: null,
});

TemplateElement.define({
    name: "f-template",
});
