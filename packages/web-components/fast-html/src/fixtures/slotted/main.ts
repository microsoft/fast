import { TemplateElement } from "@microsoft/fast-html";
import { FASTElement, observable } from "@microsoft/fast-element";

class TestElement extends FASTElement {
    @observable
    slottedNodes: Node[] = [];

    slottedNodesChanged() {
        this.classList.add(`class-${this.slottedNodes.length}`);
    }
}
TestElement.define({
    name: "test-element",
});

TemplateElement.define({
    name: "f-template",
});
