import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { attr } from "@microsoft/fast-element";

class TestElement extends RenderableFASTElement {
    @attr
    type: string = "radio";
}
TestElement.define({
    name: "test-element",
    shadowOptions: null,
});

TemplateElement.define({
    name: "f-template",
});
