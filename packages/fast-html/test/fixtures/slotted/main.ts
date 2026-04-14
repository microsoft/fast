import { FASTElement, observable } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";

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
RenderableFASTElement(TestElement).defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

let hydrationCompleteEmitted = false;
(window as any).getHydrationCompleteStatus = () => hydrationCompleteEmitted;

TemplateElement.config({
    hydrationComplete() {
        hydrationCompleteEmitted = true;
    },
}).define({
    name: "f-template",
});
