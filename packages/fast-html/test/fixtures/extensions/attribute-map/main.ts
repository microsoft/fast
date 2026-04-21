import { attr, FASTElement } from "@microsoft/fast-element";
import { attributeMap, TemplateElement } from "@microsoft/fast-html";

class AttributeMapTestElement extends FASTElement {
    public setFoo() {
        (this as any).foo = "hello";
    }

    public setFooBar() {
        (this as any)["foo-bar"] = "world";
    }

    public setMultiple() {
        (this as any).foo = "updated";
        (this as any)["foo-bar"] = "also-updated";
    }
}

AttributeMapTestElement.defineAsync({ name: "attribute-map-test-element" });

class AttributeMapWithExistingAttrElement extends FASTElement {
    @attr
    foo: string = "original";
}

AttributeMapWithExistingAttrElement.defineAsync({
    name: "attribute-map-existing-attr-test-element",
});

attributeMap()("attribute-map-test-element");
attributeMap()("attribute-map-existing-attr-test-element");

TemplateElement.define({ name: "f-template" });
