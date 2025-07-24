import { FASTElement } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";

class TestElement extends FASTElement {
    public object: any = {
        foo: "bar",
    };
}
RenderableFASTElement(TestElement).defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({
    name: "f-template",
});
