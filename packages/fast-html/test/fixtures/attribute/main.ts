import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { attr, FASTElement } from "@microsoft/fast-element";

class TestElement extends FASTElement {
    @attr
    type: string = "radio";
}
RenderableFASTElement(TestElement).defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

class TestBoolCondition extends FASTElement {
    @attr({ attribute: "active-group" })
    activeGroup: string = "";

    @attr({ attribute: "current-group" })
    currentGroup: string = "";
}
RenderableFASTElement(TestBoolCondition).defineAsync({
    name: "test-bool-condition",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({
    name: "f-template",
});
