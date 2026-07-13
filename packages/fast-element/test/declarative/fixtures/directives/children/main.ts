import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { enableHydration } from "@microsoft/fast-element/hydration.js";
import { observable } from "@microsoft/fast-element/observable.js";

class TestElement extends FASTElement {
    @observable
    listItems: Node[] = [];

    @observable
    list: Array<string> = ["Foo", "Bar"];

    @observable
    firstItem: Element | null;

    // `{trailingSingle filter elements() single}` — the `single` flag written
    // after the filter clause rather than before it.
    @observable
    trailingSingle: Element | null;

    // Left uninitialized so the empty-children bind transitions undefined -> null,
    // which is the only way the change notification can be observed.
    @observable
    emptyItem: Element | null;

    emptyItemChanged() {
        (window as any).emptyItemNotified = true;
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
