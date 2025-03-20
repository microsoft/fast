import { TemplateElement } from "@microsoft/fast-html";
import { FASTElement } from "@microsoft/fast-element";

class TestElement extends FASTElement {
    public object: any = {
        foo: "bar",
    };
}
TestElement.define({
    name: "test-element",
});

TemplateElement.define({
    name: "f-template",
});
