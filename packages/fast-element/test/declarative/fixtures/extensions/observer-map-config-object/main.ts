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
    [
        observerMap({
            properties: {
                data: true,
            },
        }),
    ],
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
    [
        attributeMap({
            "attribute-name-strategy": "none",
        }),
    ],
);

// Use explicit non-default configuration objects to exercise the config-object path
TemplateElement.define({ name: "f-template" });
