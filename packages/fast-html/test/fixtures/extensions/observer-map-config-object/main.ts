import { FASTElement } from "@microsoft/fast-element";
import { attributeMap, observerMap, TemplateElement } from "@microsoft/fast-html";

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

ConfigObserverMapTestElement.defineAsync({
    name: "config-observer-map-test-element",
});

class ConfigAttributeMapTestElement extends FASTElement {
    public setLabel() {
        (this as any).label = "new-label";
    }
}

ConfigAttributeMapTestElement.defineAsync({
    name: "config-attribute-map-test-element",
});

// Use currying functions without config — should behave like "all"
observerMap()("config-observer-map-test-element");
attributeMap()("config-attribute-map-test-element");

TemplateElement.define({ name: "f-template" });
