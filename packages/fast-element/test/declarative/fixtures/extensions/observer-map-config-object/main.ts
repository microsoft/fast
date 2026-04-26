import { FASTElement } from "@microsoft/fast-element";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { attributeMap } from "@microsoft/fast-element/extensions/attribute-map.js";
import { observerMap } from "@microsoft/fast-element/extensions/observer-map.js";

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
        template: declarativeTemplate(),
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
        template: declarativeTemplate(),
    },
    [
        attributeMap({
            "attribute-name-strategy": "none",
        }),
    ],
);
