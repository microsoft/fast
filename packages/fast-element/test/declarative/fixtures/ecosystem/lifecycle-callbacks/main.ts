import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-element/declarative.js";

// Track lifecycle callbacks for testing
export const lifecycleEvents: Array<{ callback: string; name?: string }> = [];

// Configure lifecycle callbacks
TemplateElement.config({
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
    hydrationComplete(): void {
        lifecycleEvents.push({ callback: "hydrationComplete" });
        (window as any).hydrationCompleted = true;
    },
});

// Simple element with basic property
class SimpleElement extends FASTElement {
    @attr
    message: string = "Hello";
}

SimpleElement.define({
    name: "simple-element",
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

ComplexElement.define({
    name: "complex-element",
});

// Nested element
class NestedElement extends FASTElement {
    @attr
    label: string = "Nested";
}

NestedElement.define({
    name: "nested-element",
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
});

// Define templates
TemplateElement.options({
    "complex-element": {
        observerMap: {},
    },
}).define({
    name: "f-template",
});

// Make lifecycleEvents available globally for testing
(window as any).lifecycleEvents = lifecycleEvents;
