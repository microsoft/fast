import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { enableHydration } from "@microsoft/fast-element/hydration.js";
import { observable } from "@microsoft/fast-element/observable.js";
import { observerMap } from "@microsoft/fast-element/observer-map.js";

export const promiseEvents: Array<{ promise: string; name?: string }> = [];

const hydration = enableHydration();
void hydration.whenHydrated.then(() => {
    promiseEvents.push({ promise: "whenHydrated" });
    (window as any).hydrationCompleted = true;
});

class SimpleElement extends FASTElement {
    @attr
    message: string = "Hello";
}

SimpleElement.define({
    name: "simple-element",
    template: declarativeTemplate(),
});

class ComplexElement extends FASTElement {
    @attr
    title: string = "Complex";

    @observable
    count: number = 0;

    @observable
    items: string[] = [];

    increment() {
        this.count++;
    }

    addItem(item: string) {
        this.items = [...this.items, item];
    }
}

ComplexElement.define(
    {
        name: "complex-element",
        template: declarativeTemplate(),
    },
    [observerMap()],
);

class NestedElement extends FASTElement {
    @attr
    label: string = "Nested";
}

NestedElement.define({
    name: "nested-element",
    template: declarativeTemplate(),
});

class DeferredElement extends FASTElement {
    @attr
    status: string = "pending";

    connectedCallback() {
        super.connectedCallback();
        setTimeout(() => {
            this.status = "ready";
        }, 100);
    }
}

DeferredElement.define({
    name: "deferred-element",
    template: declarativeTemplate(),
});

class DeferredParentElement extends FASTElement {
    @attr
    label: string = "Parent";

    connectedCallback() {
        super.connectedCallback();
    }
}

DeferredParentElement.define({
    name: "deferred-parent-element",
    template: declarativeTemplate(),
});

class DeferredChildElement extends FASTElement {
    @attr
    label: string = "Child";

    connectedCallback() {
        super.connectedCallback();
    }
}

DeferredChildElement.define({
    name: "deferred-child-element",
    template: declarativeTemplate(),
});

(window as any).promiseEvents = promiseEvents;
