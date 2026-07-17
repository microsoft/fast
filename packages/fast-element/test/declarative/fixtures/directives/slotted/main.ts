import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { enableHydration } from "@microsoft/fast-element/hydration.js";
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

    @observable
    slottedSingleNode: Element | null;

    // Left uninitialized so the empty-slot bind transitions undefined -> null,
    // which is the only way the change notification can be observed.
    @observable
    slottedEmptyNode: Element | null;

    slottedEmptyNodeChanged() {
        (window as any).slottedEmptyNodeNotified = true;
    }
}
TestElement.define({
    name: "test-element",
    template: declarativeTemplate(),
});

const hydration = enableHydration();
void hydration.whenHydrated().then(() => {
    (window as any).hydrationCompleted = true;
});
