import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { observable } from "@microsoft/fast-element";

class TestElement extends RenderableFASTElement {
    @observable
    slottedNodes: Node[] = [];

    slottedNodesChanged() {
        this.classList.add(`class-${this.slottedNodes.length}`);
    }
}
TestElement.define({
    name: "test-element",
    shadowOptions: null,
});

TemplateElement.define({
    name: "f-template",
});
