import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { attr, FASTElement, observable } from "@microsoft/fast-element";

class TestElement extends FASTElement {
    @attr
    type: string = "radio";
}
RenderableFASTElement(TestElement).defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

class BoolNegateElement extends FASTElement {
    @observable
    isEnabled: boolean = true;
}
RenderableFASTElement(BoolNegateElement).defineAsync({
    name: "bool-negate-element",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({
    name: "f-template",
});
