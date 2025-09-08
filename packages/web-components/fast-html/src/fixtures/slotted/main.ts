import { TemplateElement } from "@microsoft/fast-html";
import { FASTElement, observable } from "@microsoft/fast-element";

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
TestElement.defineAsync({
    name: "test-element",
    templateOptions: "hydrate",
});

TemplateElement.define({
    name: "f-template",
});
