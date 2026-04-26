import { FASTElement } from "@microsoft/fast-element";
import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { attributeMap } from "@microsoft/fast-element/extensions/attribute-map.js";

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

AttributeMapTestElement.define(
    {
        name: "attribute-map-test-element",
        template: declarativeTemplate(),
    },
    [attributeMap()],
);

class AttributeMapWithExistingAttrElement extends FASTElement {
    @attr
    foo: string = "original";
}

AttributeMapWithExistingAttrElement.define(
    {
        name: "attribute-map-existing-attr-test-element",
        template: declarativeTemplate(),
    },
    [attributeMap()],
);
