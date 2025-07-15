import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { attr } from "@microsoft/fast-element";

class TestElement extends RenderableFASTElement {
    @attr
    type: string = "radio";
}
TestElement.defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({
    name: "f-template",
});
