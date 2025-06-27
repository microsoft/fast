import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";

class TestElement extends RenderableFASTElement {
    public object: any = {
        foo: "bar",
    };
}
TestElement.define({
    name: "test-element",
    shadowOptions: null,
});

TemplateElement.define({
    name: "f-template",
});
