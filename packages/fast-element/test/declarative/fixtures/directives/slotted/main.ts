import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { enableHydration, whenHydrated } from "@microsoft/fast-element/hydration.js";
import { observable } from "@microsoft/fast-element/observable.js";

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
    template: declarativeTemplate(),
});

enableHydration();
void whenHydrated.then(() => {
    (window as any).hydrationCompleted = true;
});
