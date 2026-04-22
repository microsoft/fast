import { attributeMap, FASTElement, observerMap } from "@microsoft/fast-element";
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
    templateOptions: "defer-and-hydrate",
}, [observerMap()]);

class ConfigAttributeMapTestElement extends FASTElement {
    public setLabel() {
        (this as any).label = "new-label";
    }
}

ConfigAttributeMapTestElement.define({
    name: "config-attribute-map-test-element",
    templateOptions: "defer-and-hydrate",
}, [attributeMap()]);

TemplateElement.define({ name: "f-template" });
