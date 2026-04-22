import { attr, attributeMap, FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";

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

AttributeMapTestElement.define({
    name: "attribute-map-test-element",
    templateOptions: "defer-and-hydrate",
}, [attributeMap()]);

class AttributeMapWithExistingAttrElement extends FASTElement {
    @attr
    foo: string = "original";
}

AttributeMapWithExistingAttrElement.define({
    name: "attribute-map-existing-attr-test-element",
    templateOptions: "defer-and-hydrate",
}, [attributeMap()]);

TemplateElement.define({ name: "f-template" });
