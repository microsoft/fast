import { TemplateElement } from "@microsoft/fast-btr";
import { attr, FASTElement } from "@microsoft/fast-element";

class TestElement extends FASTElement {
    @attr
    text: string = "Hello";
}
TestElement.define({
    name: "test-element",
});

TemplateElement.define({
    name: "f-template",
});
