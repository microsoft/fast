import { TemplateElement } from "@microsoft/fast-html";
import { FASTElement } from "@microsoft/fast-element";

class TestElement extends FASTElement {
    public items = ["Hello", "World"];
}
TestElement.define({
    name: "test-element",
});

TemplateElement.define({
    name: "f-template",
});
