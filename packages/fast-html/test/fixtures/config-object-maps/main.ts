import { FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";

class ConfigObserverMapTestElement extends FASTElement {
    public data: any = {
        message: "hello",
        nested: {
            value: 42,
        },
    };

    public updateMessage() {
        this.data.message = "updated";
    }

    public updateNestedValue() {
        this.data.nested.value = 99;
    }
}

ConfigObserverMapTestElement.define({
    name: "config-observer-map-test-element",
});

class ConfigAttributeMapTestElement extends FASTElement {
    public setLabel() {
        (this as any).label = "new-label";
    }
}

ConfigAttributeMapTestElement.define({
    name: "config-attribute-map-test-element",
});

// Use configuration objects ({}) instead of "all" — should behave identically
TemplateElement.options({
    "config-observer-map-test-element": {
        observerMap: {},
    },
    "config-attribute-map-test-element": {
        attributeMap: {},
    },
}).define({ name: "f-template" });
