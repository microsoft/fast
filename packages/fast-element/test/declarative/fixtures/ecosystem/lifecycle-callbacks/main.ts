import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { enableHydration } from "@microsoft/fast-element/hydration.js";
import { observable } from "@microsoft/fast-element/observable.js";
import { observerMap } from "@microsoft/fast-element/observer-map.js";

// Track lifecycle callbacks for testing
export const lifecycleEvents: Array<{ callback: string; name?: string }> = [];

// Enable hydration with global callback
enableHydration({
    hydrationComplete(): void {
        lifecycleEvents.push({ callback: "hydrationComplete" });
        (window as any).hydrationCompleted = true;
    },
});

// Per-element lifecycle callbacks
const lifecycleCallbacks = {
    elementDidRegister(name: string): void {
        lifecycleEvents.push({ callback: "elementDidRegister", name });
    },
    templateWillUpdate(name: string): void {
        lifecycleEvents.push({ callback: "templateWillUpdate", name });
    },
    templateDidUpdate(name: string): void {
        lifecycleEvents.push({ callback: "templateDidUpdate", name });
    },
    elementDidDefine(name: string): void {
        lifecycleEvents.push({ callback: "elementDidDefine", name });
    },
};

// Simple element with basic property
class SimpleElement extends FASTElement {
    @attr
    message: string = "Hello";
}

SimpleElement.define({
    name: "simple-element",
    template: declarativeTemplate(lifecycleCallbacks),
});

// Complex element with multiple properties and methods
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
        template: declarativeTemplate(lifecycleCallbacks),
    },
    [observerMap()],
);

// Nested element
class NestedElement extends FASTElement {
    @attr
    label: string = "Nested";
}

NestedElement.define({
    name: "nested-element",
    template: declarativeTemplate(lifecycleCallbacks),
});

// Element with deferred hydration
class DeferredElement extends FASTElement {
    @attr
    status: string = "pending";

    connectedCallback() {
        super.connectedCallback();
        // Simulate async work
        setTimeout(() => {
            this.status = "ready";
        }, 100);
    }
}

DeferredElement.define({
    name: "deferred-element",
    template: declarativeTemplate(lifecycleCallbacks),
});

// Nested deferred elements to verify parent-first hydration
class DeferredParentElement extends FASTElement {
    @attr
    label: string = "Parent";

    connectedCallback() {
        super.connectedCallback();
    }
}

DeferredParentElement.define({
    name: "deferred-parent-element",
    template: declarativeTemplate(lifecycleCallbacks),
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
    template: declarativeTemplate(lifecycleCallbacks),
});

// Make lifecycleEvents available globally for testing
(window as any).lifecycleEvents = lifecycleEvents;
