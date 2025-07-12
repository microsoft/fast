import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";

class TestElement extends RenderableFASTElement {
    public object: any = {
        foo: "bar",
    };
}
TestElement.defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({
    name: "f-template",
});
