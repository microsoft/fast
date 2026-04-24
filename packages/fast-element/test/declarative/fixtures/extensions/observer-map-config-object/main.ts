import { FASTElement } from "@microsoft/fast-element";
import {
    attributeMap,
    observerMap,
    TemplateElement,
} from "@microsoft/fast-element/declarative.js";

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

ConfigObserverMapTestElement.define(
    {
        name: "config-observer-map-test-element",
    },
    [observerMap({})],
);

class ConfigAttributeMapTestElement extends FASTElement {
    public setLabel() {
        (this as any).label = "new-label";
    }
}

ConfigAttributeMapTestElement.define(
    {
        name: "config-attribute-map-test-element",
    },
    [attributeMap({})],
);

// Use configuration objects ({}) instead of "all" — should behave identically
TemplateElement.define({ name: "f-template" });
